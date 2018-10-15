import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import {ArticleStock} from "../entity/ArticleStock";
import {CustomerOrderItem} from "../entity/CustomerOrderItem";

@EventSubscriber()
export class CustomerOrderItemQuantityUpdateSubscriber implements EntitySubscriberInterface<CustomerOrderItem> {
  public listenTo() {
    return CustomerOrderItem;
  }

  public async afterInsert(event: InsertEvent<CustomerOrderItem>) {
    await this.add(event.manager, event.entity);
  }

  public async beforeUpdate(event: UpdateEvent<CustomerOrderItem>) {
    await this.remove(event.manager, event.databaseEntity);
  }

  public async afterUpdate(event: UpdateEvent<CustomerOrderItem>) {
    await this.add(event.manager, event.entity);
  }

  public async beforeRemove(event: RemoveEvent<CustomerOrderItem>) {
    await this.remove(event.manager, event.entity);
  }

  private async add(manager: EntityManager, entity: CustomerOrderItem) {
    const stock = await manager.getRepository(ArticleStock).findOne(entity.articleStock.id);
    if (entity.checkedOut) {
      stock.quantity -= +entity.quantity;
    } else {
      stock.reservedQuantity += +entity.quantity;
    }
    await manager.getRepository(ArticleStock).save(stock);
  }

  private async remove(manager: EntityManager, entity: CustomerOrderItem) {
    if (!entity.articleStock) {
      entity = await manager.getRepository(CustomerOrderItem).findOne(entity.id, {relations: ["articleStock"]});
    }
    const stock = await manager.getRepository(ArticleStock).findOne(entity.articleStock.id);
    if (entity.checkedOut) {
      stock.quantity += +entity.quantity;
    } else {
      stock.reservedQuantity -= +entity.quantity;
    }
    await manager.getRepository(ArticleStock).save(stock);
  }
}
