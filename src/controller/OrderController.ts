import { OrderConverter } from "../converter/OrderConverter";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { OrderStockQuantityUpdater } from "./OrderStockQuantityUpdater";
import { AppDataSource } from "../utils/app-data-source";
import { Request, Response } from "express";
import { EntityManager } from "typeorm";

//@JsonController("/api/order")
export class OrderController {

  private static withAllRelations = [
    "user",
    "location",
    "orderItems",
    "orderItems.article",
    "orderItems.article.unitOfMeasurement",
    "plannedCheckout",
  ];

  static async get(req: Request, res: Response) {
    const { id } = req.params;
    return await AppDataSource.transaction(async (manager) => {
      const order = await manager.getRepository(Order).findOne({ where: { id: +id } });
      return res.status(200).json(OrderConverter.toDto(order));
    });
  }

  static async getAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const orders = await manager.getRepository(Order).find({
        order: {
          id: "ASC"
        },
      });
      return res.status(200).json(OrderConverter.toDtos(orders));
    });
  }

  static async update(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const newOrder = OrderConverter.toEntity(req.body);
      const orderRepository = manager.getRepository(Order);
      const loadedOrder = await orderRepository.findOne({ where: { id: +id } });
      const mergedOrder = orderRepository.merge(loadedOrder, newOrder);
      await OrderController.updateTotalPriceBeforeUpdate(manager, mergedOrder);
      await OrderStockQuantityUpdater.removeStockQuantityBeforeUpdate(manager, mergedOrder.id);
      const updatedOrder = await orderRepository.save(mergedOrder);
      await OrderStockQuantityUpdater.addStockQuantityAfterUpdate(manager, mergedOrder.id);
      return res.status(200).json(OrderConverter.toDto(updatedOrder));
    });
  }

  static async save(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const newOrder = OrderConverter.toEntity(req.body);
      const savedOrder = await manager.getRepository(Order).save(newOrder);
      await OrderStockQuantityUpdater.addStockQuantityAfterUpdate(manager, savedOrder.id);
      return res.status(200).json(OrderConverter.toDto(savedOrder));
    });
  }


  static async delete(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const orderToDelete = new Order();
      orderToDelete.id = +id;
      await OrderStockQuantityUpdater.removeStockQuantityBeforeUpdate(manager, orderToDelete.id);
      const deletedOrder = await manager.getRepository(Order).remove(orderToDelete);
      return res.status(200).json(OrderConverter.toDto(deletedOrder));
    });
  }

  static async getWithAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const order = await manager.getRepository(Order).findOne({
        where: { id: +id },
        relations: this.withAllRelations,
        order: { id: "ASC" },
      });
      return res.status(200).json(OrderConverter.toDto(order));
    });
  }

  static async getAllWithAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const order = await manager.getRepository(Order).find({
        relations: this.withAllRelations,
        order: { id: "ASC" },
      });
      return res.status(200).json(OrderConverter.toDtos(order));
    });
  }

  static async getMyOrders(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const userId = req["currentUser"].id;
      const order = await manager.getRepository(Order).findOne({
        where: { user: { id: +userId } },
        relations: this.withAllRelations,
        order: { id: "ASC" },
      });
      return res.status(200).json(OrderConverter.toDto(order));
    });
  }

  static async getByUser(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const order = await manager.getRepository(Order).findOne({
        where: { user: { id: +id } },
        relations: this.withAllRelations,
        order: { id: "ASC" },
      });
      return res.status(200).json(OrderConverter.toDto(order));
    });
  }

  static async deleteWithAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const orderToDelete = new Order();
      orderToDelete.id = +id;
      await OrderStockQuantityUpdater.removeStockQuantityBeforeUpdate(manager, orderToDelete.id);
      const extendedOrder = await manager.getRepository(Order).findOne({ where: { id: +id }, relations: ["orderItems"] });
      for (const item of extendedOrder.orderItems) {
        await manager.getRepository(OrderItem).remove(item);
      }
      const deletedOrder = await manager.getRepository(Order).remove(orderToDelete);
      return res.status(200).json(OrderConverter.toDto(deletedOrder));
    });
  }

  private static async updateTotalPriceBeforeUpdate(manager: EntityManager, modifiedOrder: Order) {
    const loadedOrder = await manager.getRepository(Order).findOne({
      where: { id: modifiedOrder.id }
    });
    modifiedOrder.totalPrice = loadedOrder.totalPrice;
  }
}
