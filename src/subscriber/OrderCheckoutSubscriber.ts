import {Authorized} from "routing-controllers";
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
import {Order} from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";
import {User} from "../entity/User";

@Authorized("admin")
@EventSubscriber()
export class OrderCheckoutSubscriber implements EntitySubscriberInterface<Order> {
  public listenTo() {
    return Order;
  }

  public async beforeRemove(event: RemoveEvent<Order>) {
    await this.doBefore(event);
  }

  public async beforeUpdate(event: UpdateEvent<Order>) {
    await this.doBefore(event);
  }

  public async afterUpdate(event: UpdateEvent<Order>) {
    await this.doAfter(event);
  }

  public async afterInsert(event: InsertEvent<Order>) {
    await this.doAfter(event);
  }

  private async doBefore(event: RemoveEvent<Order> | UpdateEvent<Order>) {
    const completeOrder = await this.loadOrderItems(event.manager, event.entity);
    if (this.wasCheckedOut(event)) {
      await this.addStockQuantities(completeOrder.checkedOutOrderItems, completeOrder.location.id, event.manager);
    } else {
      await this.addStockReservedQuantities(completeOrder.orderItems, completeOrder.location.id, event.manager);
    }
  }

  private async doAfter(event: InsertEvent<Order> | UpdateEvent<Order>) {
    const completeOrder = await this.loadOrderItems(event.manager, event.entity);
    if (this.isCheckedout(event)) {
      await this.removeStockQuantities(completeOrder.checkedOutOrderItems, completeOrder.location.id, event.manager);
      await this.setTimestampIfNotAlreadySet(event);
    } else {
      await this.removeStockReservedQuantities(completeOrder.orderItems, completeOrder.location.id, event.manager);
      this.resetTimestamp(event);
    }
  }

  private resetTimestamp(event: UpdateEvent<Order> | InsertEvent<Order>) {
    event.entity.checkedOutDate = null;
    event.entity.checkingOutUser = null;
  }

  private async setTimestampIfNotAlreadySet(event: UpdateEvent<Order> | InsertEvent<Order>) {
    if (!event.entity.checkingOutUser) {
      const user = await event.manager.getRepository(User).findOne(event.queryRunner.data);
      event.entity.checkedOutDate = new Date();
      event.entity.checkingOutUser = user;
    }
  }

  private async removeStockQuantities(items: CheckedOutOrderItem[], locationId: number, manager: EntityManager) {
    if (items) {
      for (const item of items) {
        const articleStock = await this.loadArticleStock(manager, item.article.id, locationId);
        articleStock.quantity -= item.quantity;
        await manager.getRepository(ArticleStock).save(articleStock);
      }
    }
  }

  private async addStockQuantities(items: CheckedOutOrderItem[], locationId: number, manager: EntityManager) {
    if (items) {
      for (const item of items) {
        const articleStock = await this.loadArticleStock(manager, item.article.id, locationId);
        articleStock.quantity += item.quantity;
        await manager.getRepository(ArticleStock).save(articleStock);
      }
    }
  }

  private async removeStockReservedQuantities(items: OrderItem[], locationId: number, manager: EntityManager) {
    if (items) {
      for (const item of items) {
        const articleStock = await this.loadArticleStock(manager, item.article.id, locationId);
        articleStock.reservedQuantity -= item.quantity;
        await manager.getRepository(ArticleStock).save(articleStock);
      }
    }
  }

  private async addStockReservedQuantities(items: OrderItem[], locationId: number, manager: EntityManager) {
    if (items) {
      for (const item of items) {
        const articleStock = await this.loadArticleStock(manager, item.article.id, locationId);
        articleStock.reservedQuantity += item.quantity;
        await manager.getRepository(ArticleStock).save(articleStock);
      }
    }
  }

  private async loadArticleStock(manager: EntityManager, articleId: number, locationId: number): Promise<ArticleStock> {
    return (await manager.getRepository(ArticleStock)
      .find({
        where:
          {
            article: {id: articleId},
            location: {id: locationId},
          },
      }))[0];
  }

  private async loadOrderItems(manager: EntityManager, order: Order) {
    const completeOrder = await manager.getRepository(Order).findOne(order.id,
      {
        relations: [
          "location",
          "orderItems",
          "orderItems.article",
          "checkedOutOrderItems",
          "checkedOutOrderItems.article",
        ],
      });
    return completeOrder;
  }

  private wasCheckedOut(event: UpdateEvent<Order> | RemoveEvent<Order>) {
    return event.databaseEntity.checkedOut;
  }

  private isCheckedout(event: UpdateEvent<Order> | InsertEvent<Order>) {
    return event.entity.checkedOut;
  }
}
