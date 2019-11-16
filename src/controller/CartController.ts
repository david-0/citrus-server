import {CartDto} from "citrus-common";
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
        const item = new OrderItem();
        item.article = articleStock[0].article;
        item.copiedPrice = cartItem.price;
        item.quantity = cartItem.quantity;
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
    let orderTextTable = "";
    let orderHtmlTable = "";
    for (const orderItem of order.orderItems) {
      const textLine = ("" + orderItem.quantity).padStart(7) + " " + orderItem.article.unitOfMeasurement.shortcut.padEnd(8) +
        orderItem.article.description.padEnd(32) + "CHF " + Number(orderItem.copiedPrice * orderItem.quantity).toFixed(2);
      orderTextTable += textLine + "\r\n\r\n";
      const htmlLine = "<tr><td align='right'>" + orderItem.quantity + "</td><td>" + orderItem.article.unitOfMeasurement.shortcut +
        "</td><td>" + orderItem.article.description + "</td><td>CHF</td><td  align='right'>" + Number(orderItem.copiedPrice * orderItem.quantity).toFixed(2) + "</td></tr>";
      orderHtmlTable += htmlLine;
    }
    const textTotal = "CHF ".padStart(52) + order.totalPrice + "\r\n\r\n\r\n";
    orderTextTable += textTotal;
    const htmlTotal = "<tr><td></td><td></td><td>Total</td><td>CHF " + order.totalPrice + "</td></tr>";
    orderHtmlTable += htmlTotal;
    await this.mailService.sendMail(order.user.email, "Bestellbestätigung",
      "Sehr geehrte Kundin, sehr geehrter Kunde,\r\n\r\n" +
      "Vielen Dank für Ihre Bestellung.\r\n\r\n" +
      orderTextTable +
      "Abholung der Früchte: " +
      "Zeit: zwischen " + this.formatDate(order.plannedCheckout.fromDate) + " und " + this.formatDate(order.plannedCheckout.toDate) + "\r\n" +
      "Ort: " + order.location.description + ", " + order.location.street + " " + order.location.number + ", " +
      order.location.zipcode + " " + order.location.city + "\r\n\r\n" +
      "Freundlich Grüsse\r\n" +
      "Ihr Früchtebestellungs Team",
      "<h3>Sehr geehrte Kundin, sehr geehrter Kunde</h3>" +
      "<p>Vielen Dank für Ihre Bestellung.</p>" +
      "<table><tr><th>Anzahl</th><th></th><th>Beschreibung</th><th></th><th>Preis</th></tr>" +
      orderHtmlTable + "</table>" +
      "<p>Abholung der Früchte: </p>" +
      "<p>Zeit: zwischen " + this.formatDate(order.plannedCheckout.fromDate) + " und " + this.formatDate(order.plannedCheckout.toDate) + "</p>" +
      "<p>Ort: " + order.location.description + ", " + order.location.street + " " + order.location.number +
      ", " + order.location.zipcode + " " + order.location.city + "</p>" +
      "<p>Freundliche Grüsse</p>" +
      "<p>Ihr Früchtebestellungs Team</p>");
  }

  private formatDate(date: Date): string {
    return date.getDay() + "." + date.getMonth() + "." + date.getFullYear() + " " +
      ("" + date.getHours()).padStart(2, "0") + ":" + ("" + date.getMinutes()).padStart(2, "0");
  }
}
