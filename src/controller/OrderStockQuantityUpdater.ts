import { Order } from "../entity/Order";
import { ArticleStock } from "../entity/ArticleStock";
import { EntityManager } from "typeorm";

export class OrderStockQuantityUpdater {
  static async addStockQuantityAfterUpdate(manager: EntityManager, orderId: number) {
    const loadedOrder = await OrderStockQuantityUpdater.loadOrderWithArticle(manager, orderId);
    await OrderStockQuantityUpdater.updateStockQuantityWhenAdd(manager, loadedOrder);
  }

  static async removeStockQuantityBeforeUpdate(manager: EntityManager, orderId: number) {
    const loadedOrder = await OrderStockQuantityUpdater.loadOrderWithArticle(manager, orderId);
    await OrderStockQuantityUpdater.updateStockQuantityWhenRemove(manager, loadedOrder);
  }

  private static async updateStockQuantityWhenAdd(manager: EntityManager, newOrder: Order) {
    for (const orderItem of newOrder.orderItems) {
      const stock = await OrderStockQuantityUpdater.loadArticleStock(manager, orderItem.article.id, newOrder.location.id);
      stock.reservedQuantity += +orderItem.quantity;
      await manager.getRepository(ArticleStock).save(stock);
    }
  }

  private static async updateStockQuantityWhenRemove(manager: EntityManager, existingOrder: Order) {
    for (const orderItem of existingOrder.orderItems) {
      const stock = await OrderStockQuantityUpdater.loadArticleStock(manager, orderItem.article.id, existingOrder.location.id);
      stock.reservedQuantity -= +orderItem.quantity;
      await manager.getRepository(ArticleStock).save(stock);
    }
  }

  private static async loadArticleStock(manager: EntityManager, articleId: number, locationId: number): Promise<ArticleStock> {
    return (await manager.getRepository(ArticleStock)
      .find({
        relations: ["article", "location"],
        where:
        {
          article: { id: articleId },
          location: { id: locationId },
        },
      }))[0];
  }

  private static async loadOrderWithArticle(manager: EntityManager, orderId: number): Promise<Order> {
    return await manager.getRepository(Order).findOne({
      where: { id: orderId },
      relations: [
        "orderItems",
        "orderItems.article",
        "location",
      ],
    });
  }
}
