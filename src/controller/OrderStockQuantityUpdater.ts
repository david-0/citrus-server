import { EntityManager } from "typeorm";
import { Order } from "../entity/Order";
import { ArticleStock } from "../entity/ArticleStock";

export class OrderStockQuantityUpdater {
  public async addStockQuantityAfterUpdate(manager: EntityManager, orderId: number) {
    const loadedOrder = await this.loadOrderWithArticle(manager, orderId);
    await this.updateStockQuantityWhenAdd(manager, loadedOrder);
  }

  public async removeStockQuantityBeforeUpdate(manager: EntityManager, orderId: number) {
    const loadedOrder = await this.loadOrderWithArticle(manager, orderId);
    await this.updateStockQuantityWhenRemove(manager, loadedOrder);
  }

  private async updateStockQuantityWhenAdd(manager: EntityManager, newOrder: Order) {
    for (const orderItem of newOrder.orderItems) {
      const stock = await this.loadArticleStock(manager, orderItem.article.id, newOrder.location.id);
      stock.reservedQuantity += +orderItem.quantity;
      await manager.getRepository(ArticleStock).save(stock);
    }
  }

  private async updateStockQuantityWhenRemove(manager: EntityManager, existingOrder: Order) {
    for (const orderItem of existingOrder.orderItems) {
      const stock = await this.loadArticleStock(manager, orderItem.article.id, existingOrder.location.id);
      stock.reservedQuantity -= +orderItem.quantity;
      await manager.getRepository(ArticleStock).save(stock);
    }
  }

  private async loadArticleStock(manager: EntityManager, articleId: number, locationId: number): Promise<ArticleStock> {
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

  private async loadOrderWithArticle(manager: EntityManager, orderId: number): Promise<Order> {
    return await manager.getRepository(Order).findOne(orderId, {
      relations: [
        "orderItems",
        "orderItems.article",
        "location",
      ],
    });
  }
}
