import {EntityManager, EntityRepository, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent} from "typeorm";
import {Order} from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";

@EventSubscriber()
export class OrderItemTotalPriceUpdateSubscriber implements EntitySubscriberInterface<OrderItem> {
  public listenTo() {
    return OrderItem;
  }

  public async afterInsert(event: InsertEvent<OrderItem>) {
    await this.updateAfter(event.manager, event.entity.id);
  }

  public async afterUpdate(event: UpdateEvent<OrderItem>) {
    await this.updateAfter(event.manager, event.entity.id);
  }

  public async beforeRemove(event: RemoveEvent<OrderItem>) {
    const entity = await this.reloadOrder(event.entityId, event.manager);
    let totalPrice = this.getTotalPrice(entity.order.orderItems, event.entityId);
    await this.updateTotalPrice(event.manager, entity.order.id, totalPrice);
  }

  private async updateAfter(manager: EntityManager, orderItemId: number) {
    const entity = await this.reloadOrder(orderItemId, manager);
    let totalPrice = this.getTotalPrice(entity.order.orderItems, orderItemId);
    totalPrice += +entity.copiedPrice * +entity.quantity;
    await this.updateTotalPrice(manager, entity.order.id, totalPrice);
  }

  private async reloadOrder(orderItemId: number, manager: EntityManager): Promise<OrderItem> {
    const r = await manager.getRepository(OrderItem).findOne(orderItemId, {
        relations: [
          "order",
          "order.orderItems",
        ],
      });
    return r;
  }

  private getTotalPrice(items: OrderItem[], excludeItemId: number) {
    let totalPrice = 0;
    if (items) {
      items.forEach(item => {
        if (item.id !== excludeItemId) {
          totalPrice += this.getPrice(item);
        }
      });
    }
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
