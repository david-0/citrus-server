import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import {CheckedOutOrderItem} from "../entity/CheckedOutOrderItem";
import {Order} from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";

@EventSubscriber()
export class OrderItemTotalPriceUpdateSubscriber implements EntitySubscriberInterface<OrderItem> {
  public listenTo() {
    return OrderItem;
  }

  public async afterInsert(event: InsertEvent<OrderItem>) {
    await this.updateAfter(event.manager, event.entity);
  }

  public async afterUpdate(event: UpdateEvent<OrderItem>) {
    await this.updateAfter(event.manager, event.entity);
  }

  public async beforeRemove(event: RemoveEvent<OrderItem>) {
    await this.updateBefore(event.manager, event.entity);
  }

  private async updateAfter(manager: EntityManager, entity: OrderItem) {
    entity = await this.reloadOrder(entity, manager);
    let totalPrice = this.getTotalPrice(entity.order.orderItems, entity.id);
    totalPrice += +entity.copiedPrice * +entity.quantity;
    await this.updateTotalPrice(manager, entity.order.id, totalPrice);
  }

  private async updateBefore(manager: EntityManager, entity: CheckedOutOrderItem) {
    entity = await this.reloadOrder(entity, manager);
    const checkedOutTotalPrice = this.getTotalPrice(entity.order.checkedOutOrderItems, entity.id);
    await this.updateTotalPrice(manager, entity.order.id, checkedOutTotalPrice);
  }

  private async reloadOrder(entity: OrderItem, manager: EntityManager) {
    if (!entity.order) {
      entity = await manager.getRepository(OrderItem).findOne(entity.id, {
        relations: [
          "order",
          "order.orderItems",
        ],
      });
    }
    return entity;
  }

  private getTotalPrice(items: OrderItem[], excludeItemId: number) {
    let totalPrice = 0;
    items.forEach(item => {
      if (item.id !== excludeItemId) {
        totalPrice += this.getPrice(item);
      }
    });
    return totalPrice;
  }

  private getPrice(item: OrderItem) {
    return +item.copiedPrice * +item.quantity;
  }

  private async updateTotalPrice(manager: EntityManager, orderId: number, totalPrice: number) {
    const order = await manager.getRepository(Order).findOne(orderId);
    order.totalPrice = totalPrice;
    await manager.getRepository(Order).save(order);
  }
}
