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

@EventSubscriber()
export class CheckedOutOrderItemTotalPriceUpdateSubscriber implements EntitySubscriberInterface<CheckedOutOrderItem> {
  public listenTo() {
    return CheckedOutOrderItem;
  }

  public async afterInsert(event: InsertEvent<CheckedOutOrderItem>) {
    await this.updateAfter(event.manager, event.entity);
  }

  public async afterUpdate(event: UpdateEvent<CheckedOutOrderItem>) {
    await this.updateAfter(event.manager, event.entity);
  }

  public async beforeRemove(event: RemoveEvent<CheckedOutOrderItem>) {
    await this.updateBefore(event.manager, event.entity);
  }

  private async updateAfter(manager: EntityManager, entity: CheckedOutOrderItem) {
    entity = await this.reloadOrder(entity, manager);
    let checkedOutTotalPrice = this.getTotalPrice(entity.order.checkedOutOrderItems, entity.id);
    checkedOutTotalPrice += +entity.copiedPrice * +entity.quantity;
    await this.updateCheckedOutTotalPrice(manager, entity.order.id, checkedOutTotalPrice);
  }

  private async updateBefore(manager: EntityManager, entity: CheckedOutOrderItem) {
    entity = await this.reloadOrder(entity, manager);
    const checkedOutTotalPrice = this.getTotalPrice(entity.order.checkedOutOrderItems, entity.id);
    await this.updateCheckedOutTotalPrice(manager, entity.order.id, checkedOutTotalPrice);
  }

  private async reloadOrder(entity: CheckedOutOrderItem, manager: EntityManager) {
    if (!entity.order) {
      entity = await manager.getRepository(CheckedOutOrderItem).findOne(entity.id, {
        relations: [
          "order",
          "order.checkedOutOrderItems",
        ],
      });
    }
    return entity;
  }

  private getTotalPrice(items: CheckedOutOrderItem[], excludeItemId: number) {
    let checkedOutTotalPrice = 0;
    items.forEach(item => {
      if (item.id !== excludeItemId) {
        checkedOutTotalPrice += this.getPrice(item);
      }
    });
    return checkedOutTotalPrice;
  }

  private getPrice(item: CheckedOutOrderItem) {
    return +item.copiedPrice * +item.quantity;
  }

  private async updateCheckedOutTotalPrice(manager: EntityManager, orderId: number, checkedOutTotalPrice: number) {
    const order = await manager.getRepository(Order).findOne(orderId);
    order.checkedOutTotalPrice = checkedOutTotalPrice;
    await manager.getRepository(Order).save(order);
  }
}
