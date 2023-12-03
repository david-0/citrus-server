import {
  EntityManager,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import {ArticleStock} from "../entity/ArticleStock";
import {OrderItem} from "../entity/OrderItem";
import { Logger, getLogger } from "log4js";

//@EventSubscriber()
// To delete, when everything is checked
export class OrderItemQuantityUpdateSubscriber implements EntitySubscriberInterface<OrderItem> {
  private LOGGER: Logger = getLogger("OrderItemQuantityUpdateSubscriber");

  public listenTo() {
    return OrderItem;
  }

  public async afterInsert(event: InsertEvent<OrderItem>) {
    this.LOGGER.info("start after insert, entity: " + JSON.stringify(event.entity));
    await this.add(event.manager, event.entity);
    this.LOGGER.info("end after insert");
  }

  public async beforeUpdate(event: UpdateEvent<OrderItem>) {
    this.LOGGER.info("start before update, database-entity: " + JSON.stringify(event.databaseEntity));
    await this.remove(event.manager, event.databaseEntity);
    this.LOGGER.info("end before update");
  }

  public async afterUpdate(event: UpdateEvent<OrderItem>) {
    this.LOGGER.info("start after update, entity: " + JSON.stringify(event.entity));
    await this.add(event.manager, <OrderItem> event.entity);
    this.LOGGER.info("end after update");
  }

  public async beforeRemove(event: RemoveEvent<OrderItem>) {
    this.LOGGER.info("start before remove, entity: " + JSON.stringify(event.entity));
    await this.remove(event.manager, event.entity);
    this.LOGGER.info("end before remove");
  }

  private async add(manager: EntityManager, entity: OrderItem) {
    entity = await this.ensureOrderAndArticleLoaded(entity, manager);
    const stock = await this. loadArticleStock(manager, entity.article.id, entity.order.location.id);
    if (!entity.order.checkedOut) {
      this.LOGGER.info("add: orderItem: " + JSON.stringify(entity) + ", stock: " + JSON.stringify(stock));
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
