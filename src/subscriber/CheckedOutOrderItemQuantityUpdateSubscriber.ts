import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import {ArticleStock} from "../entity/ArticleStock";
import {CheckedOutOrderItem} from "../entity/CheckedOutOrderItem";
import {OrderItem} from "../entity/OrderItem";

@EventSubscriber()
export class CheckedOutOrderItemQuantityUpdateSubscriber implements EntitySubscriberInterface<CheckedOutOrderItem> {
  public listenTo() {
    return CheckedOutOrderItem;
  }

  public async afterInsert(event: InsertEvent<CheckedOutOrderItem>) {
    // await this.add(event.manager, event.entity);
  }

  public async beforeUpdate(event: UpdateEvent<CheckedOutOrderItem>) {
    // await this.remove(event.manager, event.databaseEntity);
  }

  public async afterUpdate(event: UpdateEvent<CheckedOutOrderItem>) {
    // await this.add(event.manager, event.entity);
  }

  public async beforeRemove(event: RemoveEvent<CheckedOutOrderItem>) {
    // await this.remove(event.manager, event.entity);
  }

  private async add(manager: EntityManager, entity: CheckedOutOrderItem) {
    entity = await this.ensureOrderAndArticleLoaded(entity, manager);
    const stock = await this.loadArticleStock(manager, entity.article.id, entity.order.location.id);
    if (entity.order.checkedOut) {
      stock.quantity -= +entity.quantity;
    }
    await manager.getRepository(ArticleStock).save(stock);
  }

  private async remove(manager: EntityManager, entity: CheckedOutOrderItem) {
    entity = await this.ensureOrderAndArticleLoaded(entity, manager);
    const stock = await this.loadArticleStock(manager, entity.article.id, entity.order.location.id);
    if (entity.order.checkedOut) {
      stock.quantity += +entity.quantity;
    }
    await manager.getRepository(ArticleStock).save(stock);
  }

  private async ensureOrderAndArticleLoaded(entity: OrderItem, manager: EntityManager) {
    if (!entity.article || !entity.order) {
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
