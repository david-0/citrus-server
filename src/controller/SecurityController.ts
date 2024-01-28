import * as bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { Container } from "typedi";
import { ResetToken } from "../entity/ResetToken";
import { User } from "../entity/User";
import { UserAudit } from "../entity/UserAudit";
import { UserNotConfirmed } from "../entity/UserNotConfirmed";
import { UrlService } from "../utils/UrlService";
import { v4 as uuid } from 'uuid';
import { DateTime } from "luxon";
import { AppDataSource } from "../utils/app-data-source";
import { AppMailService } from "../utils/app-mail-service";
import { AppJwtConfiguration } from "../utils/app-jwt-configuration";
import { UserConverter } from "../converter/UserConverter";
import { EntityManager } from "typeorm";

export class SecurityController {

  static async authenticateEndpoint(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const body: any = req.body;

      const user = await SecurityController.findUserbyEmail(manager, body.email);
      if (!user) {
        await this.authenticateAudit(manager, "not registered", user, body, req);
        res.status(403);
        return "login NOT successfull";
      }
      const checkedUser = await SecurityController.checkLogin(user, body.password);
      if (!!checkedUser && (typeof checkedUser !== "string")) {
        await this.authenticateAudit(manager, "success", checkedUser, body, req);
        return { token: SecurityController.createToken(checkedUser) };
      }
      await this.authenticateAudit(manager, "password failed", user, body, req);
      res.status(403);
      return "login NOT successfull";
    });
  }

  static async addChangePasswordEndpoint(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const currentUserId = req["currentUser"].id;
      const { id: userId } = req.params;
      const body: any = req.body;
      const user = await SecurityController.findUserbyId(manager, +userId);
      const currentUser = await SecurityController.findUserbyId(manager, currentUserId);
      await SecurityController.updatePassword(manager, user.id, body.password);
      await SecurityController.changePasswordAudit(manager, currentUser, user, req);
      return res.status(200).json(UserConverter.toDto(user));
    });
  }

  static async addChangeMyPasswordEndpoint(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const currentUserId = req["currentUser"].id;
      const { id: userId } = req.params;
      const body: any = req.body;
      const user = await SecurityController.findUserbyId(manager, +userId);
      const userPassword = await SecurityController.getUserPassword(manager, +userId);
      const ok: boolean = await bcrypt.compare(body.currentPassword, userPassword.password);
      if (!ok) {
        await SecurityController.changeMyPasswordAudit(manager, "password failed", user, req);
        return res.status(403).send("password not changed");
      }
      await SecurityController.updatePassword(manager, user.id, body.password);
      await SecurityController.changeMyPasswordAudit(manager, "success", user, req);
      return res.status(200).json(UserConverter.toDto(user));
    });
  }

  static async resetPasswordWithTokenEndpoint(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const body: any = req.body;
      const resetToken = await this.findResetTokenByToken(manager, body.token);
      if (resetToken && resetToken.user) {
        await SecurityController.updatePassword(manager, resetToken.user.id, body.password);
        await SecurityController.changePasswordWithTokenAudit(manager, "success", resetToken.user, req);
        await manager.getRepository(ResetToken).remove(resetToken);
        return res.status(200).json(resetToken.user);
      }
      await SecurityController.changePasswordWithTokenAudit(manager, "token not valid", resetToken.user, req);
      return res.status(403).send("Token not valid");
    });
  }

  static async createTokenByEmailEndpoint(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const body: any = req.body;
      const user = await SecurityController.findUserbyEmail(manager, body.email);
      if (user) {
        const resetToken = new ResetToken();
        resetToken.user = user;
        resetToken.token = uuid();
        resetToken.validTo = DateTime.now().plus({ hours: 2 }).toJSDate();
        const insertResult = await manager.getRepository(ResetToken).insert(resetToken);
        await SecurityController.sendResetToken(user, resetToken.token);
        await SecurityController.sendResetTokenAudit(manager, user, body.email, req);
      } else {
        await SecurityController.sendResetTokenAudit(manager, user, body.email, req);
      }
      return res.status(200).send();
    });
  }

  static async register(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const body: any = req.body;
      const existingUser = await SecurityController.findUserbyEmail(manager, body.email);
      const existingUserNotConfirmed = await SecurityController.findUserNotConfirmedByEmail(manager, body.email);
      if (existingUser || existingUserNotConfirmed) {
        await SecurityController.tryRegisterAlreadyExistingUserAudit(manager, body.name, body.prename, body.phoneNumber, body.email, req);
        return Promise.resolve(1);
      }
      const newUser = new UserNotConfirmed();
      newUser.name = body.name;
      newUser.prename = body.prename;
      newUser.email = body.email;
      newUser.phoneNumber = body.phoneNumber;
      newUser.token = uuid();
      newUser.validTo = DateTime.now().plus({ hours: 2 }).toJSDate();
      try {
        await manager.getRepository(UserNotConfirmed).save(newUser);
        await SecurityController.sendActivationToken(newUser);
        await SecurityController.registerUserAudit(manager, newUser, req);
        return Promise.resolve(0);
      } catch (e) {
        await this.registerUserWithExceptionAudit(manager, newUser, req, e);
        return Promise.resolve(2);
      }
    });
  }

  static async userConfirmation(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const body: any = req.body;
      const newUserNotConfirmed = await SecurityController.findUserNotConfirmedByToken(manager, body.token);
      if (!newUserNotConfirmed) {
        await SecurityController.tryUserConfirmationUserAlreadyExistsAudit(manager, body.token, req);
        return Promise.resolve(false);
      }
      const existingUser = await SecurityController.findUserbyEmail(manager, newUserNotConfirmed.email);
      if (existingUser) {
        await SecurityController.userConfirmationTokenNotValidAudit(manager, newUserNotConfirmed, req);
        return Promise.resolve(false);
      }
      const newUser = new User();
      newUser.name = newUserNotConfirmed.name;
      newUser.prename = newUserNotConfirmed.prename;
      newUser.email = newUserNotConfirmed.email;
      newUser.phone = newUserNotConfirmed.phoneNumber;
      try {
        await manager.getRepository(User).save(newUser);
        const userId = (await SecurityController.findUserbyEmail(manager, newUser.email)).id;
        await SecurityController.updatePassword(manager, userId, body.password);
        await manager.getRepository(UserNotConfirmed).delete({ token: body.token });
        await SecurityController.userConfirmedAudit(manager, newUser, req);
        return Promise.resolve(true);
      } catch (e) {
        await SecurityController.userNotConfirmedAudit(manager, newUser, req, e);
        return Promise.resolve(false);
      }
    });
  }

  private static async authenticateAudit(manager: EntityManager, actionResult: string, user: any, body: any, request: Request) {
    const audit = {
      action: "authenticate",
      actionResult,
      additionalData: body.email,
      user,
    };
    await manager.getRepository(UserAudit).save(audit, { data: request });
  }

  private static async updatePassword(manager: EntityManager, userId: number, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, 10);
    await manager.getRepository(User).update({ id: userId }, { password: passwordHash });
    return;
  }

  private static async findUserbyId(manager: EntityManager, userId: number): Promise<User> {
    return await manager.getRepository(User).findOne({
      where: { id: userId },
    });
  }

  private static async getUserPassword(manager: EntityManager, userId: number): Promise<User> {
    return await manager.getRepository(User).findOne({
      where: { id: userId },
      select: ["password"]
    });
  }

  private static async findResetTokenByToken(manager: EntityManager, token: string): Promise<ResetToken | undefined> {
    const resetToken = await manager.getRepository(ResetToken).findOne({
      where: { token },
      relations: ["user"]
    });
    if (resetToken && (resetToken.validTo >= new Date())) {
      return resetToken;
    }
    return undefined;
  }

  private static async findUserNotConfirmedByToken(manager: EntityManager, token: string): Promise<UserNotConfirmed | undefined> {
    const userNotConfirmed = await manager.getRepository(UserNotConfirmed).findOne({
      where: { token }
    });
    if (userNotConfirmed && (userNotConfirmed.validTo >= new Date())) {
      return userNotConfirmed;
    }
    return undefined;
  }

  private static async findUserNotConfirmedByEmail(manager: EntityManager, email: string): Promise<UserNotConfirmed | undefined> {
    const userNotConfirmed = await manager.getRepository(UserNotConfirmed).findOne({
      where: { email },
    });
    if (userNotConfirmed && (userNotConfirmed.validTo >= new Date())) {
      return userNotConfirmed;
    }
    return undefined;
  }

  private static async findUserbyEmail(manager: EntityManager, emailAddress: string): Promise<User | undefined> {
    return await manager.getRepository(User)
      .createQueryBuilder("user")
      .addSelect("user.password")
      .leftJoinAndSelect("user.roles", "roles")
      .where("user.email = :email", { email: emailAddress })
      .getOne();
  }

  private static async checkLogin(user: User, password: string): Promise<any> {
    if (!!user && user.password.length > 0) {
      const ok: boolean = await bcrypt.compare(password, user.password);
      if (ok) {
        return user;
      }
    }
    return await new Promise<string>((resolve, reject) => resolve("Login not successful!"));
  }

  private static createToken(user: User): string {
    const roles = user.roles.map(role => role.name);
    return sign({ id: user.id, roles },
      AppJwtConfiguration.getSignSecret(), AppJwtConfiguration.getSignOptions());
  }

  private static async changePasswordAudit(manager: EntityManager, currentUser: User, userToChange: User, request: Request) {
    const audit = {
      action: "changePassword",
      actionResult: "ok",
      additionalData: userToChange.email,
      user: currentUser,
    };
    await manager.getRepository(UserAudit).save(audit, { data: request });
  }

  private static async changeMyPasswordAudit(manager: EntityManager, actionResult: string, user: User, request: Request) {
    const audit = {
      action: "changeMyPassword",
      actionResult,
      user,
    };
    await manager.getRepository(UserAudit).save(audit, { data: request });
  }

  private static async changePasswordWithTokenAudit(manager: EntityManager, actionResult: string, user: User, request: Request) {
    const audit = {
      action: "changePasswordWithToken",
      actionResult,
      user,
    };
    await manager.getRepository(UserAudit).save(audit, { data: request });
  }

  private static async sendResetTokenAudit(manager: EntityManager, user: User, email: string, request: Request) {
    const audit = {
      action: "sendResetToken",
      actionResult: user ? "user found" : "user not found",
      additionalData: user ? undefined : email,
      user,
    };
    await manager.getRepository(UserAudit).save(audit, { data: request });
  }

  private static async registerUserAudit(manager: EntityManager, userNotConfirmed: UserNotConfirmed, request: Request) {
    const user: User = undefined;
    const audit = {
      action: "registerUser",
      actionResult: "user registered",
      additionalData: userNotConfirmed.name + ", " + userNotConfirmed.prename + ", " + userNotConfirmed.phoneNumber + ", " + userNotConfirmed.email,
      user,
    };
    await manager.getRepository(UserAudit).save(audit, { data: request });
  }

  private static async userNotConfirmedAudit(manager: EntityManager, user: User, request: Request, expection: any) {
    const audit = {
      action: "userConfirmed",
      actionResult: "user not confirmed",
      additionalData: user.name + ", " + user.prename + ", " + user.phone + ", " + user.email + ", " + JSON.stringify(expection),
      user,
    };
    await manager.getRepository(UserAudit).save(audit, { data: request });
  }

  private static async userConfirmedAudit(manager: EntityManager, user: User, request: Request) {
    const audit = {
      action: "userConfirmed",
      actionResult: "user confirmed",
      additionalData: user.name + ", " + user.prename + ", " + user.phone + ", " + user.email,
      user,
    };
    await manager.getRepository(UserAudit).save(audit, { data: request });
  }

  private static async registerUserWithExceptionAudit(manager: EntityManager, userNotConfirmed: UserNotConfirmed, request: Request, exception: any) {
    const user: User = undefined;
    const audit = {
      action: "registerUser",
      actionResult: "user registered",
      additionalData: userNotConfirmed.name + ", " + userNotConfirmed.prename + ", " + userNotConfirmed.phoneNumber + ", " + userNotConfirmed.email + ", " + JSON.stringify(exception),
      user,
    };
    await manager.getRepository(UserAudit).save(audit, { data: request });
  }

  private static async tryRegisterAlreadyExistingUserAudit(manager: EntityManager, name: string, prename: string,
    phoneNumber: string, email: string, request: Request) {
    const user: User = undefined;
    const audit = {
      action: "tryRegisterAlreadyExistingUser",
      actionResult: "user already eixsts",
      additionalData: name + ", " + prename + ", " + phoneNumber + ", " + email,
      user,
    };
    await manager.getRepository(UserAudit).save(audit, { data: request });
  }

  private static async tryUserConfirmationUserAlreadyExistsAudit(manager: EntityManager, userNotConfirmed: UserNotConfirmed, request: Request) {
    const user: User = undefined;
    const audit = {
      action: "tryUserConfirmationUserAlreadyExists",
      actionResult: "user already eixsts",
      additionalData: userNotConfirmed.name + ", " + userNotConfirmed.prename + ", " + userNotConfirmed.phoneNumber + ", " + userNotConfirmed.email,
      user,
    };
    await manager.getRepository(UserAudit).save(audit, { data: request });
  }

  private static async userConfirmationTokenNotValidAudit(manager: EntityManager, userNotConfirmed: UserNotConfirmed, request: Request) {
    const user: User = undefined;
    const audit = {
      action: "userConfirmationTokenNotValid",
      actionResult: "no valid token",
      additionalData: userNotConfirmed.name + ", " + userNotConfirmed.prename + ", " + userNotConfirmed.phoneNumber + ", " + userNotConfirmed.email,
      user,
    };
    await manager.getRepository(UserAudit).save(audit, { data: request });
  }

  private static async sendResetToken(user: User, token: string) {
    const domain = Container.get(UrlService).createUrl();
    const link = `${domain}/resetPassword/${token}`;
    await AppMailService.sendMail(user.email, "Früchtebestellung - Passwort zurücksetzen",
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

  private static async sendActivationToken(userNotConfirmed: UserNotConfirmed) {
    const domain = Container.get(UrlService).createUrl();
    const link = `${domain}/userConfirmation/${userNotConfirmed.token}`;
    await AppMailService.sendMail(userNotConfirmed.email, "Früchtebestellung - Konto Aktivierung",
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