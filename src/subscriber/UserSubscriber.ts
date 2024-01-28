import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { User } from "../entity/User";
import { encrypt } from "../utils/helpers";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  public listenTo() {
    return User;
  }

  public async beforeUpdate(event: UpdateEvent<User>) {
    if (event.entity && event.entity.password) {
      event.entity.password = await encrypt.encryptpass(event.entity.password);
    }
  }

  public async beforeInsert(event: InsertEvent<User>) {
    if (event.entity && event.entity.password) {
      event.entity.password = await encrypt.encryptpass(event.entity.password);
    }
  }
}
