import * as bcrypt from "bcryptjs";
import * as express from "express";
import {sign} from "jsonwebtoken";
import * as moment from "moment";
import {Authorized, Body, CurrentUser, HttpError, JsonController, Param, Post, Req, Res} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {ResetToken} from "../entity/ResetToken";
import {Role} from "../entity/Role";
import {User} from "../entity/User";
import {UserAudit} from "../entity/UserAudit";
import {JwtConfiguration} from "../utils/JwtConfiguration";
import {MailService} from "../utils/MailService";
import uuid = require("uuid");

declare var process: any;

@JsonController()
export class SecurityController {
  // TODO Inject as Service
  private jwtConfig: JwtConfiguration;
  private mailService: MailService;

  private env: string;

  private userAuditRepo: (manager: EntityManager) => Repository<UserAudit>;

  constructor() {
    this.env = process.env.NODE_ENV || "development";
    this.jwtConfig = new JwtConfiguration(this.env);
    if (this.env === "production") {
      this.jwtConfig.initProd("../../certificate/jwt/private-key.pem", "../../certificate/jwt/public-key.pem");
    }
    this.mailService = new MailService("../../configuration/smtp.json");
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
      this.changePasswordWithTokenAudit(manager, "success", resetToken.user, request);
      await manager.getRepository(ResetToken).remove(resetToken);
      return resetToken.user;
    }
    this.changePasswordWithTokenAudit(manager, "token not valid", resetToken.user, request);
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
      resetToken.validTo = moment().add(2, "h").toDate();
      const insertResult = await manager.getRepository(ResetToken).insert(resetToken);
      await this.sendResetToken(user, resetToken.token);
      this.sendResetTokenAudit(manager, user, body.email, request);
    } else {
      this.sendResetTokenAudit(manager, user, body.email, request);
    }
    return Promise.resolve(true);
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
      this.changeMyPasswordAudit(manager, "password failed", user, request);
      return Promise.reject(new HttpError(403, "password not changed"));
    }
    await this.updatePassword(user.id, password, manager);
    this.changeMyPasswordAudit(manager, "success", user, request);
    return user;
  }

  private async changePassword(currentUserId: number, userId: number, password: string,
                               request: express.Request, manager: EntityManager): Promise<User> {
    const user = await this.findUserbyId(userId, manager);
    const currentUser = await this.findUserbyId(currentUserId, manager);
    await this.updatePassword(user.id, password, manager);
    this.changePasswordAudit(manager, currentUser, user, request);
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

  private async findUserbyEmail(manager: EntityManager, emailAddress: string): Promise<User | undefined> {
    return manager.getRepository(User)
      .createQueryBuilder("user")
      .addSelect("user.password")
      .leftJoinAndSelect("user.roles", "roles")
      .where("user.email = :email", {email: emailAddress})
      .getOne();
  }

  private requiresAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const valid: boolean = req.user && (req.user.roles.map((r: Role) => r.name)
      .filter((n: string) => n === "admin"));
    if (valid) {
      next();
    } else {
      res.status(403).json({error: `not authorized to use ${req.baseUrl}`});
    }
  }

  private async checkLogin(user: User, password: string): Promise<any> {
    if (!!user) {
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

  private changePasswordAudit(manager: EntityManager, currentUser: User, userToChange: User, request: express.Request) {
    const audit = {
      action: "changePassword",
      actionResult: "ok",
      additionalData: userToChange.email,
      user: currentUser,
    };
    this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async changeMyPasswordAudit(manager: EntityManager, actionResult: string, user: User, request: express.Request) {
    const audit = {
      action: "changeMyPassword",
      actionResult,
      user,
    };
    this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async changePasswordWithTokenAudit(manager: EntityManager, actionResult: string, user: User, request: express.Request) {
    const audit = {
      action: "changePasswordWithToken",
      actionResult,
      user,
    };
    this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async sendResetTokenAudit(manager: EntityManager, user: User, email: string, request: express.Request) {
    const audit = {
      action: "sendResetToken",
      actionResult: user ? "user found" : "user not found",
      additionalData: user ? undefined : email,
      user,
    };
    this.userAuditRepo(manager).save(audit, {data: request});
  }

  private async sendResetToken(user: User, token: string) {
    let domain = "http://localhost:4200/";
    if (this.env === "production") {
      domain = "https://88.99.118.38:3002";
    }
    const link = `${domain}resetPassword/${token}`;
    await this.mailService.sendMail(user.email, "Citrus - Passwort zurücksetzen",
      "Hallo\r\n\r\n" +
      "Du erhältst dieses Mail weil du (oder jemand anderes) für den Citrus-Benutzer '" + user.email +
      "' eine Passwort zurücksetzen Anfrage gestellt hat.\r\n\r\n" +
      "Bitte klicke auf den folgenden Link oder kopiere ihn in deinen Browser um den Vorgang abzuschliessen.\r\n" +
      "Der Link ist zwei Stunden gültig.\r\n\r\n" + link + "\r\n\r\n" +
      "Wenn du dieses Mail irrtümlich erhalten hast, kannst du es ignorieren.\r\n\r\n" +
      "Webmaster Citrus",
      "<h3>Hallo</h3>" +
      "<p>Du erhältst dieses Mail weil du (oder jemand anderes) für den Citrus Benutzer '" + user.email +
      "' eine Passwort zurücksetzen Anfrage gestellt hat.<br/>" +
      "Bitte klicke auf den folgenden Link oder kopiere ihn in deinen Browser um den Vorgang abzuschliessen.<br/>" +
      "Der Link ist zwei Stunden gültig.</p>" +
      "<a href='" + link + "'>" + link + "</a>" +
      "<p>Wenn Sie dieses Mail irrtümlich erhalten haben, können Sie es ignorieren.</p>" +
      "<p>Webmaster Citrus</p>");
  }
}

declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}
