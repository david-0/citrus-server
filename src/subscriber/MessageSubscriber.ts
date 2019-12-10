import {EntitySubscriberInterface, EventSubscriber, InsertEvent,} from "typeorm";
import {Message} from "../entity/Message";
import {User} from "../entity/User";

@EventSubscriber()
export class MessageSubscriber implements EntitySubscriberInterface<Message> {
  public listenTo() {
    return Message;
  }

  public async beforeInsert(event: InsertEvent<Message>) {
    const user = await event.manager.getRepository(User).findOne(event.queryRunner.data);
    event.entity.sendDate = new Date();
    event.entity.sendUser = user;
  }
}
