import {CartDto, CartItemDto} from "citrus-common";
import {Request} from "express";
import {Authorized, Body, CurrentUser, JsonController, Post, Req} from "routing-controllers";
import {EntityManager, Transaction, TransactionManager} from "typeorm";
import {ArticleStock} from "../entity/ArticleStock";
import {Location} from "../entity/Location";
import {OpeningHour} from "../entity/OpeningHour";
import {Order} from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";
import {User} from "../entity/User";
import {MailService} from "../utils/MailService";
import {ConfirmationController} from "./ConfirmationController";
import { OrderStockQuantityUpdater } from "./OrderStockQuantityUpdater";

@Authorized()
@JsonController("/api/cart")
export class CartController {
  private mailService: MailService;
  private stockUpdater: OrderStockQuantityUpdater;

  constructor() {
    this.mailService = new MailService("../configuration/smtp.json");
    this.stockUpdater = new OrderStockQuantityUpdater();
  }

  @Post()
  @Transaction()
  public async save(@CurrentUser({required: true}) userId: number,
                    @TransactionManager() manager: EntityManager,
                    @Body() cartDto: CartDto,
                    @Req() request: Request): Promise<Order> {
    const user: User = await manager.getRepository(User).findOne(userId);
    const order = new Order();
    order.date = new Date();
    order.user = user;
    order.orderItems = [];
    order.comment = cartDto.comment;
    order.location = await manager.getRepository(Location).findOne(cartDto.location.id);
    if (cartDto.openingHourOfPlannedCheckout) {
      order.plannedCheckout = await manager.getRepository(OpeningHour).findOne(cartDto.openingHourOfPlannedCheckout.id);
    }
    for (const cartItem of cartDto.cartItems) {
      const articleStock = await this.loadArticleStock(manager, cartItem, order);
      if (articleStock.length === 1) {
        // const available = articleStock[0].quantity - articleStock[0].reservedQuantity;
        const requested = +cartItem.quantity;
        // if (available < requested) {
        //   throw new Error(`Article (id: ${cartItem.article.id}) at location (id: ${cartDto.location.id}) not enough in stock. Available: ${available}, requested: ${requested}`);
        // }
        const item = new OrderItem();
        item.article = articleStock[0].article;
        item.copiedPrice = +cartItem.price;
        item.quantity = requested;
        order.orderItems.push(item);
      } else {
        throw new Error(`Article (id: ${cartItem.article.id} at location (id: ${cartDto.location.id}) not available.`);
      }
    }
    order.totalPrice = this.computeTotalPrice(order);
    const savedOrder = await manager.getRepository(Order).save(order);
    await this.stockUpdater.addStockQuantityAfterUpdate(manager, order.id);
    await new ConfirmationController().resendConfirmation(manager, savedOrder.id);
    return savedOrder;
  }

  private async loadArticleStock(manager: EntityManager, cartItem: CartItemDto, order: Order) {
    return await manager.getRepository(ArticleStock)
      .find({
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

  private computeTotalPrice(order: Order) {
    let totalPrice = 0;
    order.orderItems.forEach(i => {
      totalPrice += +i.copiedPrice * +i.quantity;
    });
    return totalPrice;
  }
}
