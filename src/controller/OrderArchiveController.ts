import { OrderArchiveConverter } from "../converter/OrderArchiveConverter";
import { ArticleStock } from "../entity/ArticleStock";
import { Order } from "../entity/Order";
import { OrderArchive } from "../entity/OrderArchive";
import { OrderItem } from "../entity/OrderItem";
import { User } from "../entity/User";
import { Request, Response } from "express";
import { AppDataSource } from "../utils/app-data-source";
import { EntityManager } from "typeorm";

export class OrderArchiveController {

  static async get(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const orderarchive = await manager.getRepository(OrderArchive).findOne({
        where: { id: +id }
      });
      return res.status(200).json(OrderArchiveConverter.toDto(orderarchive));
    });
  }

  static async getAll(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const orderarchives = await manager.getRepository(OrderArchive).find({
        order: { id: "ASC" },
      });
      return res.status(200).json(OrderArchiveConverter.toDtos(orderarchives));
    });
  }

  static async archiveOrder(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const userId = req["currentUser"].id;
      const { id: orderId } = req.params;
      const user = await OrderArchiveController.reloadUserWithOrderArchives(manager, userId);
      const order = await OrderArchiveController.reloadOrderWithAll(manager, +orderId);
      await OrderArchiveController.createArchiveOrderAndSave(manager, user, order);
      await OrderArchiveController.revertReservationQuantityAndDeleteOrder(manager, order);
      return res.status(200).send(+orderId);
    });
  }

  static async myOrders(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const userId = req["currentUser"].id;
      const user = await OrderArchiveController.reloadUserWithOrderArchives(manager, userId);
      const orderArchiveList = await manager.getRepository(OrderArchive).find();
      const orders = OrderArchiveConverter.toDtos(orderArchiveList)
        .filter(o => o.order.user.email === user.email)
        .sort((o1, o2) => o2.order.date.getTime() - o1.order.date.getTime());
      return res.status(200).json(orders);
    });
  }
  static async byUser(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { userId } = req.params;
      const user = await OrderArchiveController.reloadUserWithOrderArchives(manager, +userId);
      const orderArchiveList = await manager.getRepository(OrderArchive).find();
      const orders = OrderArchiveConverter.toDtos(orderArchiveList)
        .filter(o => o.order.user.email === user.email)
        .sort((o1, o2) => o2.order.date.getTime() - o1.order.date.getTime());
      return res.status(200).json(orders);
    });
  }

  private static async reloadOrderWithAll(manager: EntityManager, orderId: number) {
    return await manager.getRepository(Order).findOne({
      where: { id: orderId },
      relations: [
        "user",
        "user.roles",
        "location",
        "orderItems",
        "orderItems.article",
        "orderItems.article.unitOfMeasurement",
        "plannedCheckout",
      ],
      order: {
        id: "ASC"
      },
    });
  }

  private static async reloadUserWithOrderArchives(manager: EntityManager, userId: number) {
    return await manager.getRepository(User).findOne({
      where: { id: userId },
      relations: [
        "orderarchives",
      ],
    });
  }

  private static async revertReservationQuantityAndDeleteOrder(manager: EntityManager, order: Order,) {
    for (const item of order.orderItems) {
      await OrderArchiveController.revertReservedQuantity(manager, item, order.location.id);
      await manager.getRepository(OrderItem).remove(item);
    }
    await manager.getRepository(Order).remove(order);
  }

  private static async createArchiveOrderAndSave(manager: EntityManager, user: User, order: Order) {
    const archiveOrder = new OrderArchive();
    archiveOrder.archiveDate = new Date();
    archiveOrder.archiveUser = JSON.stringify(user);
    archiveOrder.order = JSON.stringify(order);
    await manager.getRepository(OrderArchive).save(archiveOrder);
  }

  private static async revertReservedQuantity(manager: EntityManager, orderItem: OrderItem, locationId: number) {
    const stock = await OrderArchiveController.loadArticleStock(manager, orderItem.article.id, locationId);
    stock.reservedQuantity -= +orderItem.quantity;
    await manager.getRepository(ArticleStock).save(stock);
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

  static async delete(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const { id } = req.params;
      const orderarchiveToDelete = new OrderArchive();
      orderarchiveToDelete.id = +id;
      const deletedOrderArchive = await manager.getRepository(OrderArchive).remove(orderarchiveToDelete);
      return res.status(200).json(OrderArchiveConverter.toDto(deletedOrderArchive));
    });
  }
}
