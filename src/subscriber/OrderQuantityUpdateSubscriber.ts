import {
  EntityManager,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import {ArticleStock} from "../entity/ArticleStock";
import { Order } from "../entity/Order";
import { Logger, getLogger } from "log4js";

//@EventSubscriber()
// To delete, when averything is checked
export class OrderQuantityUpdateSubscriber implements EntitySubscriberInterface<Order> {
  private LOGGER: Logger = getLogger("OrderQuantityUpdateSubscriber");
  public listenTo() {
    return Order;
  }

  public async afterInsert(event: InsertEvent<Order>) {
    this.LOGGER.info("start after insert, entity: " + JSON.stringify(event.entity));
//    await this.add(event.manager, event.entity);
    this.LOGGER.info("end after insert");
  }

  public async beforeUpdate(event: UpdateEvent<Order>) {
    this.LOGGER.info("start before update, database-entity: " + JSON.stringify(event.databaseEntity));
    await this.remove(event.manager, event.databaseEntity);
    this.LOGGER.info("end before update");
  }

  public async afterUpdate(event: UpdateEvent<Order>) {
    this.LOGGER.info("start after update, entity: " + JSON.stringify(event.entity));
    await this.add(event.manager, <Order> event.entity);
    this.LOGGER.info("end after update");
  }

  public async beforeRemove(event: RemoveEvent<Order>) {
    this.LOGGER.info("start before remove, entity: " + JSON.stringify(event.entity));
//    await this.remove(event.manager, event.entity);
    this.LOGGER.info("end before remove");
  }

  private async add(manager: EntityManager, entity: Order) {
    const order = await this.ensureOrderAndArticleLoaded(entity, manager);
    for(const orderItem of order.orderItems) {
      const stock = await this.loadArticleStock(manager, orderItem.article.id, order.location.id);
      if (!order.checkedOut) {
        this.LOGGER.info("add: order: " + JSON.stringify(entity) + ", stock: " + JSON.stringify(stock) +", orderItem: " + JSON.stringify(orderItem));
        stock.reservedQuantity += +orderItem.quantity;
      } else {
        stock.quantity -= +orderItem.quantity;        
      }
      await manager.getRepository(ArticleStock).save(stock);  
    }
  }

  private async remove(manager: EntityManager, entity: Order) {
    const order = await this.ensureOrderAndArticleLoaded(entity, manager);
    for(const orderItem of order.orderItems) {
      const stock = await this.loadArticleStock(manager, orderItem.article.id, order.location.id);
      if (!order.checkedOut) {
        stock.reservedQuantity -= +orderItem.quantity;
      } else {
        stock.quantity += +orderItem.quantity;        
      }
      await manager.getRepository(ArticleStock).save(stock);  
    }
  }

  private async ensureOrderAndArticleLoaded(entity: Order, manager: EntityManager): Promise<Order> {
      return await manager.getRepository(Order).findOne(entity.id, {
        relations: [
          "orderItems",
          "orderItems.article",
          "location",
        ],
      });
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
