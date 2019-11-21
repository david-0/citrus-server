import {CartDto} from "citrus-common";
import {Request} from "express";
import * as moment from "moment";
import {Authorized, Body, CurrentUser, JsonController, Post, Req} from "routing-controllers";
import {EntityManager, Transaction, TransactionManager} from "typeorm";
import {ArticleStock} from "../entity/ArticleStock";
import {Location} from "../entity/Location";
import {OpeningHour} from "../entity/OpeningHour";
import {Order} from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";
import {User} from "../entity/User";
import {MailService} from "../utils/MailService";

@Authorized()
@JsonController("/api/cart")
export class CartController {
  private mailService: MailService;

  constructor() {
    this.mailService = new MailService("../configuration/smtp.json");
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
    order.checkedOut = false;
    order.orderItems = [];
    order.location = await manager.getRepository(Location).findOne(cartDto.location.id);
    if (cartDto.openingHourOfPlannedCheckout) {
      order.plannedCheckout = await manager.getRepository(OpeningHour).findOne(cartDto.openingHourOfPlannedCheckout.id);
    }
    for (const cartItem of cartDto.cartItems) {
      const articleStock = await manager.getRepository(ArticleStock)
        .find({
          relations: ["article", "location"],
          where:
            {
              article: {id: cartItem.article.id},
              location: {id: order.location.id},
            },
        });
      if (articleStock.length === 1) {
        // const available = articleStock[0].quantity - articleStock[0].reservedQuantity;
        const requested = cartItem.quantity;
        // if (available < requested) {
        //   throw new Error(`Article (id: ${cartItem.article.id}) at location (id: ${cartDto.location.id}) not enough in stock. Available: ${available}, requested: ${requested}`);
        // }
        const item = new OrderItem();
        item.article = articleStock[0].article;
        item.copiedPrice = cartItem.price;
        item.quantity = requested;
        order.orderItems.push(item);
      } else {
        throw new Error(`Article (id: ${cartItem.article.id} at location (id: ${cartDto.location.id}) not available.`);
      }
    }
    order.totalPrice = this.computeTotalPrice(order);
    const savedOrder = await manager.getRepository(Order).save(order);
    const orderWithDependencies = await manager.getRepository(Order).findOne(savedOrder.id,
      {relations: ["plannedCheckout", "user", "location", "orderItems", "orderItems.article", "orderItems.article.unitOfMeasurement"]});
    await this.sendOrderConfirmation(orderWithDependencies);
    return savedOrder;
  }

  private computeTotalPrice(order: Order) {
    let totalPrice = 0;
    order.orderItems.forEach(i => {
      totalPrice += +i.copiedPrice * +i.quantity;
    });
    return totalPrice;
  }

  private async sendOrderConfirmation(order: Order) {
    let orderTextTable = "Menge".padStart(7) + " " + "".padEnd(8) + "Beschreibung".padEnd(36) + "Preis".padStart(8) + "\r\n";
    orderTextTable += "".padEnd(60, "-") + "\r\n";
    for (const orderItem of order.orderItems) {
      const textLine = ("" + orderItem.quantity).padStart(7) + " " + orderItem.article.unitOfMeasurement.shortcut.padEnd(8) +
        orderItem.article.description.padEnd(32) + "CHF " +
        ("" + Number(orderItem.copiedPrice * orderItem.quantity).toFixed(2)).padStart(8);
      orderTextTable += textLine + "\r\n";
    }
    orderTextTable += "".padEnd(60, "-") + "\r\n";
    orderTextTable += "".padStart(16) + "Total".padEnd(32) + "CHF " + ("" + Number(order.totalPrice).toFixed(2)).padStart(8) + "\r\n";
    orderTextTable += "".padEnd(48) + "".padEnd(12, "=") + "\r\n";
    await this.mailService.sendMailTextOnly(order.user.email, "Bestellbestätigung",
      "Sehr geehrte(r) " + order.user.prename + " " + order.user.name + ",\r\n\r\n" +
      "Vielen Dank für Ihre Bestellung.\r\n\r\n" +
      "    " + order.user.prename + " " + order.user.name + "\r\n" +
      "    " + order.user.phone + "\r\n" +
      "    " + order.user.email + "\r\n" +
      "\r\n" +
      "\r\n" +
      orderTextTable + "\r\n" +
      "Die Früchte können von Ihnen wie folgt abgeholt werden: \r\n" +
      "Abholstandort: " + order.location.description + "\r\n" +
      "Datum: " + this.formatDate(order.plannedCheckout.fromDate) + "\r\n" +
      "Zeit:  zwischen " + this.formatTime(order.plannedCheckout.fromDate) + " und " + this.formatTime(order.plannedCheckout.toDate) + "\r\n" +
      "Adresse: " + order.location.street + " " + order.location.number + "\r\n " +
      "".padEnd(8) + order.location.zipcode + " " + order.location.city + "\r\n" +
      "Bemerkung: " + order.location.comment + "\r\n" +
      "\r\n" +
      "Freundliche Grüsse\r\n" +
      "Ihr Früchtebestellungs Team"
    );
  }

  private formatDate(date: Date): string {
    return moment.utc(date).format("DD.MM.YYYY");
  }

  private formatTime(date: Date): string {
    return moment.utc(date).format("HH:mm");
  }
}
