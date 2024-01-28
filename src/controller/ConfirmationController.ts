import { DateTime } from "luxon";
import { Order } from "../entity/Order";
import { AppMailService } from "../utils/app-mail-service";
import { Request, Response } from "express";
import { AppDataSource } from "../utils/app-data-source";
import { EntityManager } from "typeorm";

export class ConfirmationController {

  static async resendOrderConfirmation(req: Request, res: Response) {
    return await AppDataSource.transaction(async (manager) => {
      const order: { orderId: number } = req.body;
      const result = await ConfirmationController.resendConfirmation(manager, +order.orderId);
      return res.status(200).json(result);
    });
  }

  static async resendConfirmation(manager: EntityManager, orderId: number): Promise<boolean> {
    const orderWithDependencies = await manager.getRepository(Order).findOne({
      where: { id: orderId },
      relations: ["plannedCheckout", "user", "location", "orderItems", "orderItems.article", "orderItems.article.unitOfMeasurement"]
    });
    await ConfirmationController.sendOrderConfirmation(orderWithDependencies);
    return true;
  }

  private static async sendOrderConfirmation(order: Order) {
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
      "Datum: " + ConfirmationController.formatDate(order.plannedCheckout.fromDate) + "\r\n" +
      "Zeit:  zwischen " + ConfirmationController.formatTime(order.plannedCheckout.fromDate) + " und " + ConfirmationController.formatTime(order.plannedCheckout.toDate) + "\r\n" +
      "Adresse: " + order.location.street + " " + order.location.number + "\r\n " +
      "".padEnd(8) + order.location.zipcode + " " + order.location.city + "\r\n" +
      "Bemerkung: " + order.location.comment + "\r\n" +
      "\r\n" +
      "Freundliche Grüsse\r\n" +
      "Ihr Früchtebestellungs Team";
    await AppMailService.sendMailTextOnly(order.user.email, "Bestellbestätigung", text);
  }

  private static formatDate(date: Date): string {
    return DateTime.fromJSDate(date).toFormat('dd.LL.yyyy');
  }

  private static formatTime(date: Date): string {
    return DateTime.fromJSDate(date).toLocal().toFormat('HH:mm');
  }
}
