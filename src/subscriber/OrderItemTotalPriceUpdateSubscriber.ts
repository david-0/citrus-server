import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import {Order} from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";

@EventSubscriber()
export class OrderItemTotalPriceUpdateSubscriber implements EntitySubscriberInterface<OrderItem> {
  public listenTo() {
    return OrderItem;
  }

  public async afterInsert(event: InsertEvent<OrderItem>) {
    await this.update(event.manager, event.entity);
  }

  public async afterUpdate(event: UpdateEvent<OrderItem>) {
    await this.update(event.manager, event.entity);
  }

  public async afterRemove(event: RemoveEvent<OrderItem>) {
    await this.update(event.manager, event.entity);
  }

  private async update(manager: EntityManager, entity: OrderItem) {
    if (!entity.order) {
      entity = await manager.getRepository(OrderItem).findOne(entity.id, {
        relations: [
          "order",
          "order.orderItems",
          "order.checkedOutOrderItems",
        ],
      });
    }
    let totalPrice = 0;
    entity.order.orderItems.forEach(item => {
      totalPrice += +item.copiedPrice * +item.quantity;
    });
    let checkedOutTotalPrice = 0;
    entity.order.checkedOutOrderItems.forEach(item => {
      checkedOutTotalPrice += +item.copiedPrice * +item.quantity;
    });
    const order = await manager.getRepository(Order).findOne(entity.order.id);
    order.totalPrice = totalPrice;
    order.checkoutOutTotalPrice = checkedOutTotalPrice;
    await manager.getRepository(Order).save(order);
  }
}
