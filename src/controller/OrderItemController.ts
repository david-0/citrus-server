import { OrderItemConverter } from "../converter/OrderItemConverter";
import { OrderItem } from "../entity/OrderItem";
import { ArticleStock } from "../entity/ArticleStock";
import { Order } from "../entity/Order";
import { Request, Response } from "express";
import { AppDataSource } from "../utils/app-data-source";
import { EntityManager } from "typeorm";

export class OrderItemController {

  private static withUserRelation = ["users"];

  static async get(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const orderitem = await manager.getRepository(OrderItem).findOne({ where: { id: +id } });
      return res.status(200).json(OrderItemConverter.toDto(orderitem));
    });
  }

  static async getAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const orderitems = await manager.getRepository(OrderItem).find({
        order: { id: "ASC" },
      });
      return res.status(200).json(OrderItemConverter.toDtos(orderitems));
    });
  }

  static async update(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const newOrderItem = OrderItemConverter.toEntity(req.body);
      const orderitemRepository = manager.getRepository(OrderItem);
      const loadedOrderItem = await orderitemRepository.findOne({ where: { id: +id } });
      const mergedOrderItem = orderitemRepository.merge(loadedOrderItem, newOrderItem);
      await OrderItemController.updateOnRemove(manager, mergedOrderItem);
      const updatedOrderItem = await orderitemRepository.save(mergedOrderItem);
      await OrderItemController.updateOnInsert(manager, updatedOrderItem);
      return res.status(200).json(OrderItemConverter.toDto(updatedOrderItem));
    });
  }

  static async save(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const newOrderItem = OrderItemConverter.toEntity(req.body);
      const savedOrderItem = await manager.getRepository(OrderItem).save(newOrderItem);
      await OrderItemController.updateOnInsert(manager, savedOrderItem);
      return res.status(200).json(OrderItemConverter.toDto(savedOrderItem));
    });
  }

  static async delete(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const orderitemToDelete = new OrderItem();
      orderitemToDelete.id = +id;
      await OrderItemController.updateOnRemove(manager, orderitemToDelete);
      const deletedOrderItem = await manager.getRepository(OrderItem).remove(orderitemToDelete);
      return res.status(200).json(OrderItemConverter.toDto(deletedOrderItem));
    });
  }

  private static async updateOnInsert(manager: EntityManager, entity: OrderItem) {
    await OrderItemController.updateStockOnInsert(manager, entity);
    await OrderItemController.updateTotalPriceOnInsert(manager, entity);
  }

  private static async updateOnRemove(manager: EntityManager, entity: OrderItem) {
    await OrderItemController.updateStockOnRemove(manager, entity);
    await OrderItemController.updateTotalPriceOnRemove(manager, entity);
  }

  private static async updateStockOnInsert(manager: EntityManager, entity: OrderItem) {
    const loadedEntity = await OrderItemController.ensureOrderAndArticleLoaded(manager, entity);
    const stock = await OrderItemController.loadArticleStock(manager, entity.article.id, loadedEntity.order.location.id);
    stock.reservedQuantity += +entity.quantity;
    await manager.getRepository(ArticleStock).save(stock);
  }

  private static async updateStockOnRemove(manager: EntityManager, entity: OrderItem) {
    const loadedEntity = await OrderItemController.ensureOrderAndArticleLoaded(manager, entity);
    const stock = await OrderItemController.loadArticleStock(manager, loadedEntity.article.id, loadedEntity.order.location.id);
    stock.reservedQuantity -= +loadedEntity.quantity;
    await manager.getRepository(ArticleStock).save(stock);
  }

  private static async updateTotalPriceOnInsert(manager: EntityManager, entity: OrderItem) {
    const loadedEntity = await OrderItemController.ensureOrderAndArticleLoaded(manager, entity);
    loadedEntity.order.totalPrice += loadedEntity.quantity * loadedEntity.article.price;
    await manager.getRepository(Order).save(loadedEntity.order);
  }

  private static async updateTotalPriceOnRemove(manager: EntityManager, entity: OrderItem) {
    const loadedEntity = await OrderItemController.ensureOrderAndArticleLoaded(manager, entity);
    loadedEntity.order.totalPrice -= loadedEntity.quantity * loadedEntity.article.price;
    await manager.getRepository(Order).save(loadedEntity.order);
  }

  private static async ensureOrderAndArticleLoaded(manager: EntityManager, entity: OrderItem) {
    if (!entity.article || !entity.order || !entity.order.id || !entity.order.location || !entity.order.location.id) {
      entity = await manager.getRepository(OrderItem).findOne({
        where: { id: entity.id },
        relations: [
          "article",
          "order",
          "order.location",
        ],
      });
    }
    return entity;
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
}
