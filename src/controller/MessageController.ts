import {MessageDto, UserDto} from "citrus-common";
import * as express from "express";
import {Authorized, Body, CurrentUser, JsonController, Post, Req, Res} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {Message} from "../entity/Message";
import {User} from "../entity/User";
import {MailService} from "../utils/MailService";

@Authorized("admin")
@JsonController("/api/message")
export class MessageController {
  private mailService: MailService;

  private userRepo: (manager: EntityManager) => Repository<User>;
  private messageRepo: (manager: EntityManager) => Repository<Message>;

  constructor() {
    this.mailService = new MailService("../../configuration/smtp.json");
    this.userRepo = manager => manager.getRepository(User);
    this.messageRepo = manager => manager.getRepository(Message);
  }

  @Post()
  @Transaction()
  public async sendMessage(@CurrentUser({required: true}) userId: number,
                           @TransactionManager() manager: EntityManager,
                           @Req() request: express.Request,
                           @Body() message: MessageDto,
                           @Res() response: express.Response): Promise<any> {
    const messageEntity = new Message();
    messageEntity.subject = message.subject;
    messageEntity.content = message.content;
    messageEntity.receivers = [];
    const sendMessageInfos: Array<{ user: UserDto, message: string }> = [];
    for (const userFromClient of message.receivers) {
      const user = await this.userRepo(manager).findOne(userFromClient.id);
      messageEntity.receivers.push(user);
      sendMessageInfos.push({
        message: await this.mailService.sendMailTextOnly(user.email, message.subject, message.content),
        user,
      });
    }
    messageEntity.responses = JSON.stringify(sendMessageInfos);
    return this.messageRepo(manager).save(messageEntity, {data: userId});
  }
}
