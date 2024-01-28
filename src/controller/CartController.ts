import { CartDto, CartItemDto } from "citrus-common";
import { Request, Response } from "express";
import { ArticleStock } from "../entity/ArticleStock";
import { Location } from "../entity/Location";
import { OpeningHour } from "../entity/OpeningHour";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { User } from "../entity/User";
import { ConfirmationController } from "./ConfirmationController";
import { OrderStockQuantityUpdater } from "./OrderStockQuantityUpdater";
import { AppDataSource } from "../utils/app-data-source";
import { EntityManager } from "typeorm";

export class CartController {

  static async save(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const cartDto: CartDto = req.body;
      const userId = req["currentUser"].id;
      const user: User = await manager.getRepository(User).findOne(userId);
      const order = new Order();
      order.date = new Date();
      order.user = user;
      order.orderItems = [];
      order.comment = cartDto.comment;
      order.location = await manager.getRepository(Location).findOne({
        where: { id: cartDto.location.id }
      });
      if (cartDto.openingHourOfPlannedCheckout) {
        order.plannedCheckout = await manager.getRepository(OpeningHour).findOne({
          where: { id: cartDto.openingHourOfPlannedCheckout.id }
        });
      }
      for (const cartItem of cartDto.cartItems) {
        const articleStock = await CartController.loadArticleStock(manager, cartItem, order);
        if (articleStock.length === 1) {
          const requested = +cartItem.quantity;
          const item = new OrderItem();
          item.article = articleStock[0].article;
          item.copiedPrice = +cartItem.price;
          item.quantity = requested;
          order.orderItems.push(item);
        } else {
          throw new Error(`Article (id: ${cartItem.article.id} at location (id: ${cartDto.location.id}) not available.`);
        }
      }
      order.totalPrice = CartController.computeTotalPrice(order);
      const savedOrder = await manager.getRepository(Order).save(order);
      await OrderStockQuantityUpdater.addStockQuantityAfterUpdate(manager, order.id);
      await ConfirmationController.resendConfirmation(manager, savedOrder.id);
      return savedOrder;
    });
  }

  private static async loadArticleStock(manager: EntityManager, cartItem: CartItemDto, order: Order) {
    return await manager.getRepository(ArticleStock).find({
      relations: ["article", "location"],
      order: {
        id: "ASC"
      },
      where: {
        article: { id: cartItem.article.id },
        location: { id: order.location.id },
      },
    });
  }

  private static computeTotalPrice(order: Order) {
    let totalPrice = 0;
    order.orderItems.forEach(i => {
      totalPrice += +i.copiedPrice * +i.quantity;
    });
    return totalPrice;
  }
}
