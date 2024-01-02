import { DateTime } from "luxon";
import { Authorized, Body, JsonController, Post } from "routing-controllers";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { Order } from "../entity/Order";
import { MailService } from "../utils/MailService";

@Authorized("admin")
@JsonController("/api/confirmation")
export class ConfirmationController {
  private mailService: MailService;

  constructor() {
    this.mailService = new MailService("../configuration/smtp.json");
  }

  @Post()
  @Transaction()
  public async resendOrderConfirmation(
    @TransactionManager() manager: EntityManager,
    @Body() orderId: { orderId: number }): Promise<boolean> {
    return this.resendConfirmation(manager, orderId.orderId);
  }

  public async resendConfirmation(manager: EntityManager, orderId: number): Promise<boolean> {
    const orderWithDependencies = await manager.getRepository(Order).findOne(orderId,
      { relations: ["plannedCheckout", "user", "location", "orderItems", "orderItems.article", "orderItems.article.unitOfMeasurement"] });
    await this.sendOrderConfirmation(orderWithDependencies);
    return true;
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
    let comment = "Kommentar: " + order.comment + "\r\n" + "\r\n";
    const text = "Sehr geehrte(r) " + order.user.prename + " " + order.user.name + ",\r\n\r\n" +
      "Vielen Dank für Ihre Bestellung.\r\n\r\n" +
      "    " + order.user.prename + " " + order.user.name + "\r\n" +
      "    " + order.user.phone + "\r\n" +
      "    " + order.user.email + "\r\n" +
      "\r\n" +
      "\r\n" +
      orderTextTable + "\r\n" +
      comment +
      "Die Früchte können von Ihnen wie folgt abgeholt werden: \r\n" +
      "Abholstandort: " + order.location.description + "\r\n" +
      "Datum: " + this.formatDate(order.plannedCheckout.fromDate) + "\r\n" +
      "Zeit:  zwischen " + this.formatTime(order.plannedCheckout.fromDate) + " und " + this.formatTime(order.plannedCheckout.toDate) + "\r\n" +
      "Adresse: " + order.location.street + " " + order.location.number + "\r\n " +
      "".padEnd(8) + order.location.zipcode + " " + order.location.city + "\r\n" +
      "Bemerkung: " + order.location.comment + "\r\n" +
      "\r\n" +
      "Freundliche Grüsse\r\n" +
      "Ihr Früchtebestellungs Team";
    await this.mailService.sendMailTextOnly(order.user.email, "Bestellbestätigung", text);
  }

  private formatDate(date: Date): string {
    return DateTime.fromJSDate(date).toFormat('dd.LL.yyyy');
  }

  private formatTime(date: Date): string {
    return DateTime.fromJSDate(date).toLocal().toFormat('HH:mm');
  }
}
