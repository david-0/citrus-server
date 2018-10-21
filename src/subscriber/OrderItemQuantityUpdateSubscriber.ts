import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import {ArticleStock} from "../entity/ArticleStock";
import {OrderItem} from "../entity/OrderItem";
import {OrderLocation} from "../entity/OrderLocation";

@EventSubscriber()
export class CustomerOrderItemQuantityUpdateSubscriber implements EntitySubscriberInterface<OrderItem> {
  public listenTo() {
    return OrderItem;
  }

  public async afterInsert(event: InsertEvent<OrderItem>) {
    await this.add(event.manager, event.entity);
  }

  public async beforeUpdate(event: UpdateEvent<OrderItem>) {
    await this.remove(event.manager, event.databaseEntity);
  }

  public async afterUpdate(event: UpdateEvent<OrderItem>) {
    await this.add(event.manager, event.entity);
  }

  public async beforeRemove(event: RemoveEvent<OrderItem>) {
    await this.remove(event.manager, event.entity);
  }

  private async add(manager: EntityManager, entity: OrderItem) {
    if (!entity.orderLocation) {
      entity = await manager.getRepository(OrderItem).findOne(entity.id, {relations: ["orderLocation"]});
    }
    const stock = await manager.getRepository(ArticleStock).findOne(entity.articleStock.id);
    if (entity.orderLocation.checkedOut) {
      stock.quantity -= +entity.quantity;
    } else {
      stock.reservedQuantity += +entity.quantity;
    }
    await manager.getRepository(ArticleStock).save(stock);
  }

  private async remove(manager: EntityManager, entity: OrderItem) {
    if (!entity.articleStock || !entity.orderLocation) {
      entity = await manager.getRepository(OrderItem).findOne(entity.id, {relations: ["articleStock", "orderLocation"]});
    }
    const stock = await manager.getRepository(ArticleStock).findOne(entity.articleStock.id);
    if (entity.orderLocation.checkedOut) {
      stock.quantity += +entity.quantity;
    } else {
      stock.reservedQuantity -= +entity.quantity;
    }
    await manager.getRepository(ArticleStock).save(stock);
  }
}