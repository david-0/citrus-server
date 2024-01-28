import { MessageDto, UserDto } from "citrus-common";
import * as express from "express";
import { Message } from "../entity/Message";
import { User } from "../entity/User";
import { AppDataSource } from "../utils/app-data-source";
import { AppMailService } from "../utils/app-mail-service";

export class MessageController {

  static async update(req: express.Request, res: express.Response) {
    return await AppDataSource.transaction(async (manager) => {
      const message: MessageDto = req.body;
      const userId = req["currentUser"].id;
      const messageEntity = new Message();
      messageEntity.subject = message.subject;
      messageEntity.content = message.content;
      messageEntity.receivers = [];
      const sendMessageInfos: Array<{ user: UserDto, message: string }> = [];
      for (const userFromClient of message.receivers) {
        const user = await manager.getRepository(User).findOne({
          where: { id: userFromClient.id }
        });
        messageEntity.receivers.push(user);
        const msg = await AppMailService.sendMailTextOnly(user.email, message.subject, message.content)
          .catch(error => ({ message: error.message, stack: error.stack }));
        sendMessageInfos.push({ user, message: msg });
      }
      messageEntity.responses = JSON.stringify(sendMessageInfos);
      return await manager.getRepository(Message).save(messageEntity, { data: userId });
    });
  }
}
