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

@EventSubscriber()
export class OrderItemQuantityUpdateSubscriber implements EntitySubscriberInterface<OrderItem> {
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
    await this.add(event.manager, <OrderItem> event.entity);
  }

  public async beforeRemove(event: RemoveEvent<OrderItem>) {
    await this.remove(event.manager, event.entity);
  }

  private async add(manager: EntityManager, entity: OrderItem) {
    entity = await this.ensureOrderAndArticleLoaded(entity, manager);
    const stock = await this. loadArticleStock(manager, entity.article.id, entity.order.location.id);
    if (!entity.order.checkedOut) {
      stock.reservedQuantity += +entity.quantity;
    } else {
      stock.quantity -= +entity.quantity;
    }
    await manager.getRepository(ArticleStock).save(stock);
  }

  private async remove(manager: EntityManager, entity: OrderItem) {
    entity = await this.ensureOrderAndArticleLoaded(entity, manager);
    const stock = await this.loadArticleStock(manager, entity.article.id, entity.order.location.id);
    if (!entity.order.checkedOut) {
      stock.reservedQuantity -= +entity.quantity;
    } else {
      stock.quantity += +entity.quantity;
    }
  await manager.getRepository(ArticleStock).save(stock);
  }

  private async ensureOrderAndArticleLoaded(entity: OrderItem, manager: EntityManager) {
    if (!entity.article || !entity.order || !entity.order.id || !entity.order.location || !entity.order.location.id ) {
      entity = await manager.getRepository(OrderItem).findOne(entity.id, {
        relations: [
          "article",
          "order",
          "order.location",
        ],
      });
    }
    return entity;
  }

  private async loadArticleStock(manager: EntityManager, articleId: number, locationId: number): Promise<ArticleStock> {
    return (await manager.getRepository(ArticleStock)
      .find({
        relations: ["article", "location"],
        where:
          {
            article: {id: articleId},
            location: {id: locationId},
          },
      }))[0];
  }
}
