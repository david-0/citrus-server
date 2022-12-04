import * as bcrypt from "bcryptjs";
import * as express from "express";
import {sign} from "jsonwebtoken";
import {Authorized, Body, CurrentUser, HttpError, JsonController, Param, Post, Req, Res} from "routing-controllers";
import {Container} from "typedi";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {ResetToken} from "../entity/ResetToken";
import {Role} from "../entity/Role";
import {User} from "../entity/User";
import {UserAudit} from "../entity/UserAudit";
import {UserNotConfirmed} from "../entity/UserNotConfirmed";
import {JwtConfiguration} from "../utils/JwtConfiguration";
import {MailService} from "../utils/MailService";
import {UrlService} from "../utils/UrlService";
import { v4 as uuid } from 'uuid';
import { DateTime, Duration } from "luxon";

declare var process: any;

@JsonController()
export class SecurityController {
  // TODO Inject as Service
  private jwtConfig: JwtConfiguration;
  private mailService: MailService;

  private readonly  env: string;

  private userAuditRepo: (manager: EntityManager) => Repository<UserAudit>;

  constructor() {
    this.env = process.env.NODE_ENV || "development";
    this.jwtConfig = new JwtConfiguration(this.env);
    if (this.env === "production") {
      this.jwtConfig.initProd("../certificate/jwt/private-key.pem", "../certificate/jwt/public-key.pem");
    }
    this.mailService = new MailService("../configuration/smtp.json");
    this.userAuditRepo = manager => manager.getRepository(UserAudit);
  }

  @Post("/api/authenticate")
  @Transaction()
  public async authenticateEndpoint(@TransactionManager() manager: EntityManager,
                                    @Req() request: express.Request,
                                    @Body() body: any,
                                    @Res() response: express.Response): Promise<any> {
    const user = await this.findUserbyEmail(manager, body.email);
    if (!user) {
      this.authenticateAudit(manager, "not registered", user, body, request);
      response.status(403);
      return "login NOT successfull";
    }
    const checkedUser = await this.checkLogin(user, body.password);
    if (!!checkedUser && (typeof checkedUser !== "string")) {
      this.authenticateAudit(manager, "success", checkedUser, body, request);
      return {token: this.createToken(checkedUser)};
    }
    this.authenticateAudit(manager, "password failed", user, body, request);
    response.status(403);
    return "login NOT successfull";
  }

  @Authorized("admin")
  @Post("/api/user/:id([0-9]+)/changepassword")
  @Transaction()
  public async addChangePasswordEndpoint(@TransactionManager() manager: EntityManager,
                                         @CurrentUser({required: true}) currentUserId: number,
                                         @Param("id") userId: number, @Body() body: any, @Req() request: express.Request) {
    return this.changePassword(currentUserId, userId, body.password, request, manager);
  }

  @Authorized()
  @Post("/api/user/changemypassword")
  @Transaction()
  public async addChangeMyPasswordEndpoint(@TransactionManager() manager: EntityManager,
                                           @CurrentUser({required: true}) userId: number, @Body() body: any, @Req() request: express.Request) {
    return this.changeMyPassword(manager, userId, body.currentPassword, body.password, request);
  }

  @Post("/api/user/resetPasswordWithToken")
  @Transaction()
  public async resetPasswordWithTokenEndpoint(@TransactionManager() manager: EntityManager, @Body() body: any, @Req() request: express.Request) {
    const resetToken = await this.findResetTokenByToken(manager, body.token);
    if (resetToken && resetToken.user) {
      await this.updatePassword(resetToken.user.id, body.password, manager);
      await this.changePasswordWithTokenAudit(manager, "success", resetToken.user, request);
      await manager.getRepository(ResetToken).remove(resetToken);
      return resetToken.user;
    }
    await this.changePasswordWithTokenAudit(manager, "token not valid", resetToken.user, request);
    return Promise.reject(new HttpError(403, "Token not valid"));
  }

  @Post("/api/user/createTokenByEmail")
  @Transaction()
  public async createTokenByEmailEndpoint(@TransactionManager() manager: EntityManager, @Body() body: any,
                                          @Req() request: express.Request): Promise<boolean> {
    const user = await this.findUserbyEmail(manager, body.email);
    if (user) {
      const resetToken = new ResetToken();
      resetToken.user = user;
      resetToken.token = uuid();
      resetToken.validTo = DateTime.now().plus({hours: 2}).toJSDate();
      const insertResult = await manager.getRepository(ResetToken).insert(resetToken);
      await this.sendResetToken(user, resetToken.token);
      await this.sendResetTokenAudit(manager, user, body.email, request);
    } else {
      await this.sendResetTokenAudit(manager, user, body.email, request);
    }
    return Promise.resolve(true);
  }

  @Post("/api/user/register")
  @Transaction()
  public async register(@TransactionManager() manager: EntityManager, @Body() body: any,
                        @Req() request: express.Request): Promise<number> {
    const existingUser = await this.findUserbyEmail(manager, body.email);
    const existingUserNotConfirmed = await this.findUserNotConfirmedByEmail(manager, body.email);
    if (existingUser || existingUserNotConfirmed) {
      await this.tryRegisterAlreadyExistingUserAudit(manager, body.name, body.prename, body.phoneNumber, body.email, request);
      return Promise.resolve(1);
    }
    const newUser = new UserNotConfirmed();
    newUser.name = body.name;
    newUser.prename = body.prename;
    newUser.email = body.email;
    newUser.phoneNumber = body.phoneNumber;
    newUser.token = uuid();
    newUser.validTo = DateTime.now().plus({hours: 2}).toJSDate();
    try {
      await manager.getRepository(UserNotConfirmed).save(newUser);
      await this.sendActivationToken(newUser);
      await this.registerUserAudit(manager, newUser, request);
      return Promise.resolve(0);
    } catch (e) {
      await this.registerUserWithExceptionAudit(manager, newUser, request, e);
      return Promise.resolve(2);
    }
  }

  @Post("/api/user/confirm")
  @Transaction()
  public async userConfirmation(@TransactionManager() manager: EntityManager, @Body() body: any,
                                @Req() request: express.Request): Promise<boolean> {
    const newUserNotConfirmed = await this.findUserNotConfirmedByToken(manager, body.token);
    if (!newUserNotConfirmed) {
      await this.tryUserConfirmationUserAlreadyExistsAudit(manager, body.token, request);
      return Promise.resolve(false);
    }
    const existingUser = await this.findUserbyEmail(manager, newUserNotConfirmed.email);
    if (existingUser) {
      await this.userConfirmationTokenNotValidAudit(manager, newUserNotConfirmed, request);
      return Promise.resolve(false);
    }
    const newUser = new User();
    newUser.name = newUserNotConfirmed.name;
    newUser.prename = newUserNotConfirmed.prename;
    newUser.email = newUserNotConfirmed.email;
    newUser.phone = newUserNotConfirmed.phoneNumber;
    try {
      await manager.getRepository(User).save(newUser);
      const userId = (await this.findUserbyEmail(manager, newUser.email)).id;
      await this.updatePassword(userId, body.password, manager);
      await manager.getRepository(UserNotConfirmed).delete({token: body.token});
      await this.userConfirmedAudit(manager, newUser, request);
      return Promise.resolve(true);
    } catch (e) {
      await this.userNotConfirmedAudit(manager, newUser, request, e);
      return Promise.resolve(false);
    }
  }

  private authenticateAudit(manager: EntityManager, actionResult: string,
                            user: any, body: any, request: express.Request): void {
    const audit = {
      action: "authenticate",
      actionResult,
      additionalData: body.email,
      user,
    };
    this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async changeMyPassword(manager: EntityManager, userId: number, currentPassword: string,
                                 password: string, request: express.Request): Promise<User> {
    const user = await this.findUserbyId(userId, manager);
    const userPassword = await this.getUserPassword(userId, manager);
    const ok: boolean = await bcrypt.compare(currentPassword, userPassword.password);
    if (!ok) {
      await this.changeMyPasswordAudit(manager, "password failed", user, request);
      return Promise.reject(new HttpError(403, "password not changed"));
    }
    await this.updatePassword(user.id, password, manager);
    await this.changeMyPasswordAudit(manager, "success", user, request);
    return user;
  }

  private async changePassword(currentUserId: number, userId: number, password: string,
                               request: express.Request, manager: EntityManager): Promise<User> {
    const user = await this.findUserbyId(userId, manager);
    const currentUser = await this.findUserbyId(currentUserId, manager);
    await this.updatePassword(user.id, password, manager);
    await this.changePasswordAudit(manager, currentUser, user, request);
    return user;
  }

  private async updatePassword(userId: number, password: string, manager: EntityManager): Promise<void> {
    const passwordHash = await bcrypt.hash(password, 10);
    const update = await manager.getRepository(User).update({id: userId}, {password: passwordHash});
    return;
  }

  private findUserbyId(userId: number, manager: EntityManager): Promise<User> {
    return manager.getRepository(User).findOne({id: userId});
  }

  private getUserPassword(userId: number, manager: EntityManager): Promise<User> {
    return manager.getRepository(User).findOne({id: userId}, {select: ["password"]});
  }

  private async findResetTokenByToken(manager: EntityManager, token: string): Promise<ResetToken | undefined> {
    const resetToken = await manager.getRepository(ResetToken).findOne({token}, {relations: ["user"]});
    if (resetToken && (resetToken.validTo >= new Date())) {
      return resetToken;
    }
    return undefined;
  }

  private async findUserNotConfirmedByToken(manager: EntityManager, token: string): Promise<UserNotConfirmed | undefined> {
    const userNotConfirmed = await manager.getRepository(UserNotConfirmed).findOne({token});
    if (userNotConfirmed && (userNotConfirmed.validTo >= new Date())) {
      return userNotConfirmed;
    }
    return undefined;
  }

  private async findUserNotConfirmedByEmail(manager: EntityManager, email: string): Promise<UserNotConfirmed | undefined> {
    const userNotConfirmed = await manager.getRepository(UserNotConfirmed).findOne({email});
    if (userNotConfirmed && (userNotConfirmed.validTo >= new Date())) {
      return userNotConfirmed;
    }
    return undefined;
  }

  private async findUserbyEmail(manager: EntityManager, emailAddress: string): Promise<User | undefined> {
    return manager.getRepository(User)
      .createQueryBuilder("user")
      .addSelect("user.password")
      .leftJoinAndSelect("user.roles", "roles")
      .where("user.email = :email", {email: emailAddress})
      .getOne();
  }

  private requiresAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const valid: boolean = req.user && (req.requestUser.roles.map((r: Role) => r.name)
      .filter((n: string) => n === "admin"));
    if (valid) {
      next();
    } else {
      res.status(403).json({error: `not authorized to use ${req.baseUrl}`});
    }
  }

  private async checkLogin(user: User, password: string): Promise<any> {
    if (!!user && user.password.length > 0) {
      const ok: boolean = await bcrypt.compare(password, user.password);
      if (ok) {
        return user;
      }
    }
    return new Promise<string>((resolve, reject) => resolve("Login not successful!"));
  }

  private createToken(user: User): string {
    const roles = user.roles.map(role => role.name);
    return sign({id: user.id, roles},
      this.jwtConfig.getSignSecret(), this.jwtConfig.getSignOptions());
  }

  private async changePasswordAudit(manager: EntityManager, currentUser: User, userToChange: User, request: express.Request) {
    const audit = {
      action: "changePassword",
      actionResult: "ok",
      additionalData: userToChange.email,
      user: currentUser,
    };
    await this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async changeMyPasswordAudit(manager: EntityManager, actionResult: string, user: User, request: express.Request) {
    const audit = {
      action: "changeMyPassword",
      actionResult,
      user,
    };
    await this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async changePasswordWithTokenAudit(manager: EntityManager, actionResult: string, user: User, request: express.Request) {
    const audit = {
      action: "changePasswordWithToken",
      actionResult,
      user,
    };
    await this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async sendResetTokenAudit(manager: EntityManager, user: User, email: string, request: express.Request) {
    const audit = {
      action: "sendResetToken",
      actionResult: user ? "user found" : "user not found",
      additionalData: user ? undefined : email,
      user,
    };
    await this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async registerUserAudit(manager: EntityManager, userNotConfirmed: UserNotConfirmed, request: express.Request) {
    const user: User = undefined;
    const audit = {
      action: "registerUser",
      actionResult: "user registered",
      additionalData: userNotConfirmed.name + ", " + userNotConfirmed.prename + ", " + userNotConfirmed.phoneNumber + ", " + userNotConfirmed.email,
      user,
    };
    await this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async userNotConfirmedAudit(manager: EntityManager, user: User, request: express.Request, expection: any) {
    const audit = {
      action: "userConfirmed",
      actionResult: "user not confirmed",
      additionalData: user.name + ", " + user.prename + ", " + user.phone + ", " + user.email + ", " + JSON.stringify(expection),
      user,
    };
    await this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async userConfirmedAudit(manager: EntityManager, user: User, request: express.Request) {
    const audit = {
      action: "userConfirmed",
      actionResult: "user confirmed",
      additionalData: user.name + ", " + user.prename + ", " + user.phone + ", " + user.email,
      user,
    };
    await this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async registerUserWithExceptionAudit(manager: EntityManager, userNotConfirmed: UserNotConfirmed, request: express.Request, exception: any) {
    const user: User = undefined;
    const audit = {
      action: "registerUser",
      actionResult: "user registered",
      additionalData: userNotConfirmed.name + ", " + userNotConfirmed.prename + ", " + userNotConfirmed.phoneNumber + ", " + userNotConfirmed.email + ", " + JSON.stringify(exception),
      user,
    };
    await this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async tryRegisterAlreadyExistingUserAudit(manager: EntityManager, name: string, prename: string,
                                                    phoneNumber: string, email: string, request: express.Request) {
    const user: User = undefined;
    const audit = {
      action: "tryRegisterAlreadyExistingUser",
      actionResult: "user already eixsts",
      additionalData: name + ", " + prename + ", " + phoneNumber + ", " + email,
      user,
    };
    await this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async tryUserConfirmationUserAlreadyExistsAudit(manager: EntityManager, userNotConfirmed: UserNotConfirmed, request: express.Request) {
    const user: User = undefined;
    const audit = {
      action: "tryUserConfirmationUserAlreadyExists",
      actionResult: "user already eixsts",
      additionalData: userNotConfirmed.name + ", " + userNotConfirmed.prename + ", " + userNotConfirmed.phoneNumber + ", " + userNotConfirmed.email,
      user,
    };
    await this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async userConfirmationTokenNotValidAudit(manager: EntityManager, userNotConfirmed: UserNotConfirmed, request: express.Request) {
    const user: User = undefined;
    const audit = {
      action: "userConfirmationTokenNotValid",
      actionResult: "no valid token",
      additionalData: userNotConfirmed.name + ", " + userNotConfirmed.prename + ", " + userNotConfirmed.phoneNumber + ", " + userNotConfirmed.email,
      user,
    };
    await this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async sendResetToken(user: User, token: string) {
    const domain = Container.get(UrlService).createUrl();
    const link = `${domain}/resetPassword/${token}`;
    await this.mailService.sendMail(user.email, "Früchtebestellung - Passwort zurücksetzen",
      "Hallo\r\n\r\n" +
      "Sie erhalten dieses E-Mail weil Sie (oder jemand anderes) für den Früchtebestellung-Benutzer '" + user.email +
      "' eine Passwort zurücksetzen Anfrage gestellt haben.\r\n\r\n" +
      "Bitte klicken Sie auf den folgenden Link oder kopieren Sie ihn in ihren Browser um den Vorgang abzuschliessen.\r\n" +
      "Der Link ist zwei Stunden gültig.\r\n\r\n" + link + "\r\n\r\n" +
      "Wenn Sie diese E-Mail irrtümlich erhalten haben, können Sie sie ignorieren.\r\n\r\n" +
      "Freundlich Grüsse\r\n" +
      "Ihr Früchtebestellungs Team",
      "<h3>Hallo</h3>" +
      "<p>Sie erhalten diese E-Mail weil Sie (oder jemand anderes) für den Früchtebestellung-Benutzer '" + user.email +
      "' eine Passwort zurücksetzen Anfrage gestellt haben.<br/>" +
      "Bitte klicken Sie auf den folgenden Link oder kopieren Sie ihn in ihren Browser um den Vorgang abzuschliessen.<br/>" +
      "Der Link ist zwei Stunden gültig.</p>" +
      "<a href='" + link + "'>" + link + "</a>" +
      "<p>Wenn Sie diese E-Mail irrtümlich erhalten haben, können Sie sie ignorieren.</p>" +
      "<p>Freundliche Grüsse</p>" +
      "<p>Ihr Früchtebestellungs Team</p>");
  }

  private async sendActivationToken(userNotConfirmed: UserNotConfirmed) {
    const domain = Container.get(UrlService).createUrl();
    const link = `${domain}/userConfirmation/${userNotConfirmed.token}`;
    await this.mailService.sendMail(userNotConfirmed.email, "Früchtebestellung - Konto Aktivierung",
      "Bestätigen Sie Ihre Registrierung\r\n\r\n" +
      "Guten Tag " + userNotConfirmed.email + "\r\n" +
      "Schön, dass Sie sich bei der Früchtebestellung registeriert haben.\r\n" +
      "Bitte bestätigen sie noch ihre Registrierung, damit sie unsere Dienste Nutzen können.\r\n" +
      "Der Link ist zwei Stunden gültig.\r\n\r\n" + link + "\r\n\r\n" +
      "Wenn Sie diese E-Mail irrtümlich erhalten haben, können Sie sie ignorieren.\r\n\r\n" +
      "Freundlich Grüsse\r\n" +
      "Ihr Früchtebestellungs Team",
      "<h2>Bestätigen Sie Ihre Registrierung</h2>" +
      "<h3>Guten Tag " + userNotConfirmed.email + "</h3>" +
      "<p>Schön, dass Sie sich bei der Früchtebestellung registeriert haben.</p>" +
      "<p>Bitte bestätigen sie noch ihre Registrierung, damit sie unsere Dienste Nutzen können.</p>" +
      "<p>Der Link ist zwei Stunden gültig.</p>" +
      "<a href='" + link + "'>Bestätigen</a>" +
      "<p>Wenn Sie diese E-Mail irrtümlich erhalten haben, können Sie sie ignorieren.</p>" +
      "<p>Freundliche Grüsse</p>" +
      "<p>Ihr Früchtebestellungs Team</p>");
  }
}

declare global {
  namespace Express {
    export interface Request {
      requestUser?: any;
    }
  }
}
