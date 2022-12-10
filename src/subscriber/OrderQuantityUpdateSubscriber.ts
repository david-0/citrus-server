import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import {ArticleStock} from "../entity/ArticleStock";
import { Order } from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";

@EventSubscriber()
export class OrderQuantityUpdateSubscriber implements EntitySubscriberInterface<Order> {
  public listenTo() {
    return Order;
  }

  public async afterInsert(event: InsertEvent<Order>) {
    await this.add(event.manager, event.entity);
  }

  public async beforeUpdate(event: UpdateEvent<Order>) {
    await this.remove(event.manager, event.databaseEntity);
  }

  public async afterUpdate(event: UpdateEvent<Order>) {
    await this.add(event.manager, <Order> event.entity);
  }

  public async beforeRemove(event: RemoveEvent<Order>) {
    await this.remove(event.manager, event.entity);
  }

  private async add(manager: EntityManager, entity: Order) {
    const order = await this.ensureOrderAndArticleLoaded(entity, manager);
    for(const orderItem of order.orderItems) {
      const stock = await this.loadArticleStock(manager, orderItem.article.id, order.location.id);
      if (!order.checkedOut) {
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
