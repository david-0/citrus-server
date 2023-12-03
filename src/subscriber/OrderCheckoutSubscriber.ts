import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent,} from "typeorm";
import {Order} from "../entity/Order";
import {User} from "../entity/User";

// @EventSubscriber()
export class OrderCheckoutSubscriber implements EntitySubscriberInterface<Order> {
  public listenTo() {
    return Order;
  }

  public async beforeUpdate(event: UpdateEvent<Order>) {
    if (!event.databaseEntity.checkedOut && event.entity.checkedOut) {
      const user = await event.manager.getRepository(User).findOne(event.queryRunner.data);
      event.entity.checkedOutDate = new Date();
      event.entity.checkingOutUser = user;
    } else if (event.databaseEntity.checkedOut && !event.entity.checkedOut) {
      event.entity.checkedOutDate = null;
      event.entity.checkingOutUser = null;
    }
  }

  public async beforeInsert(event: InsertEvent<Order>) {
    if (event.entity.checkedOut) {
      const user = await event.manager.getRepository(User).findOne(event.queryRunner.data);
      event.entity.checkedOutDate = new Date();
      event.entity.checkingOutUser = user;
    }
  }
}
