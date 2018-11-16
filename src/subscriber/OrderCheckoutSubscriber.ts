import {EntityManager, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from "typeorm";
import {ArticleStock} from "../entity/ArticleStock";
import {Order} from "../entity/Order";
import {User} from "../entity/User";

@EventSubscriber()
export class OrderCheckoutSubscriber implements EntitySubscriberInterface<Order> {
  public listenTo() {
    return Order;
  }

  public async beforeUpdate(event: UpdateEvent<Order>) {
    if (!event.databaseEntity.checkedOut && event.entity.checkedOut) {
      const user = await event.manager.getRepository(User).findOne(event.queryRunner.data);
      event.entity.checkedOutDate = new Date();
      event.entity.checkingOutUser = user;
      await this.updateStockQuantitiesOnCheckout(event.entity, event.manager);
    } else if (event.databaseEntity.checkedOut && !event.entity.checkedOut) {
      event.entity.checkedOutDate = null;
      event.entity.checkingOutUser = null;
      await this.updateStockQuantitiesOnDisableCheckout(event.entity, event.manager);
    }
  }

  public async beforeInsert(event: InsertEvent<Order>) {
    if (event.entity.checkedOut) {
      const user = await event.manager.getRepository(User).findOne(event.queryRunner.data);
      event.entity.checkedOutDate = new Date();
      event.entity.checkingOutUser = user;
      await this.updateStockQuantitiesOnCheckout(event.entity, event.manager);
    }
  }

  private async updateStockQuantitiesOnCheckout(order: Order, manager: EntityManager) {
    const completeOrder = await this.loadOrderItems(manager, order);
    if (completeOrder.orderItems) {
      for (const item of completeOrder.orderItems) {
        const articleStock = await this.loadArticleStock(manager, item.article.id, order.location.id);
        articleStock.reservedQuantity -= item.quantity;
        await manager.getRepository(ArticleStock).save(articleStock);
      }
    }
    if (completeOrder.checkedOutOrderItems) {
      for (const checkedOutItem of completeOrder.checkedOutOrderItems) {
        const articleStock = await this.loadArticleStock(manager, checkedOutItem.article.id, order.location.id);
        articleStock.quantity += checkedOutItem.quantity;
        await manager.getRepository(ArticleStock).save(articleStock);
      }
    }
  }

  private async updateStockQuantitiesOnDisableCheckout(order: Order, manager: EntityManager) {
    const completeOrder = await this.loadOrderItems(manager, order);
    if (completeOrder.orderItems) {
      for (const item of completeOrder.orderItems) {
        const articleStock = await this.loadArticleStock(manager, item.article.id, order.location.id);
        articleStock.reservedQuantity += item.quantity;
        await manager.getRepository(ArticleStock).save(articleStock);
      }
    }
    if (completeOrder.checkedOutOrderItems) {
      for (const checkedOutItem of completeOrder.checkedOutOrderItems) {
        const articleStock = await this.loadArticleStock(manager, checkedOutItem.article.id, order.location.id);
        articleStock.quantity -= checkedOutItem.quantity;
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
}
