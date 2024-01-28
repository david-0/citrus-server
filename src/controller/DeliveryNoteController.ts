// @ts-ignore
import { UserDto, OrderDto } from "citrus-common";
import * as express from "express";
import { User } from "../entity/User";
import { Order } from "../entity/Order";
import doc = require("pdfkit");
import { DateTime } from "luxon";
import { AppDataSource } from "../utils/app-data-source";
import { EntityManager } from "typeorm";

export class DeliveryNoteController {
  private static margin = 40;
  private static padding = 10;

  static async returnDeliveryNote(req: express.Request, res: express.Response) {
    return await AppDataSource.transaction(async (manager) => {
      const orderIds: number[] = req.body;
      const userId = req["currentUser"].id;
      const currentUser: UserDto = await manager.getRepository(User).findOne({
        where: { id: userId }
      });
      res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
      res.attachment("Lieferschein.pdf");
      res.contentType('application/pdf');

      let myDoc = new doc({ bufferPages: true, autoFirstPage: false });
      myDoc.pipe(res);

      const currentDate = new Date();

      const orders = await DeliveryNoteController.loadOrders(manager, orderIds);
      orders.sort((a, b) => DeliveryNoteController.comparator(a, b));

      let lastLocationId = undefined;
      let page = 0;
      for (let order of orders) {
        await DeliveryNoteController.updateDeliveryDate(manager, order, currentDate);
        if (lastLocationId !== order.location.id && !DeliveryNoteController.isEven(page)) {
          page++;
        }
        if (DeliveryNoteController.isEven(+page)) {
          myDoc.addPage({
            margin: 0,
            size: [595, 839]
          });
          DeliveryNoteController.printContent(myDoc, order, 0, currentUser);
        } else {
          DeliveryNoteController.printContent(myDoc, order, 1, currentUser);
        }
        page++;
        lastLocationId = order.location.id;
      }
      myDoc.end();
      return;
    });
  }

  private static comparator(a: OrderDto, b: OrderDto) {
    const comparedLocationId = a.location.id - b.location.id;
    if (comparedLocationId != 0) {
      return comparedLocationId;
    }
    const comparedName = a.user.name.localeCompare(b.user.name);
    if (comparedName != 0) {
      return comparedName;
    }
    const comparedPrename = a.user.prename.localeCompare(b.user.prename);
    if (comparedPrename != 0) {
      return comparedPrename;
    }
    const comparedId = a.id - b.id;
    return comparedId;
  }

  private static async loadOrders(manager: EntityManager, orderIds: number[]): Promise<OrderDto[]> {
    let result = [];
    for (let orderId of orderIds) {
      result.push(await DeliveryNoteController.getOrder(manager, orderId));
    }
    return result;
  }

  private static isEven(n: number): boolean {
    return n % 2 == 0;
  }

  private static async updateDeliveryDate(manager: EntityManager, order: OrderDto, currentDate: Date) {
    order.deliveryNoteCreated = currentDate;
    await manager.getRepository(Order).save(order);
  }

  private static printContent(myDoc: PDFKit.PDFDocument, order: OrderDto, pagePart: number, currentUser: UserDto) {
    const widthA5 = DeliveryNoteController.convert(210);
    const width = widthA5 - 2 * DeliveryNoteController.margin;
    const heightA5 = DeliveryNoteController.convert(148);
    const height = heightA5 - 2 * DeliveryNoteController.margin;
    const offset = pagePart * heightA5;
    const addressColumnRight = DeliveryNoteController.margin + width - DeliveryNoteController.convert(65);

    myDoc.lineWidth(1) //
      .moveTo(DeliveryNoteController.margin, DeliveryNoteController.margin + offset)
      .lineTo(DeliveryNoteController.margin + width, DeliveryNoteController.margin + offset)
      .lineTo(DeliveryNoteController.margin + width, DeliveryNoteController.margin + offset + height)
      .lineTo(DeliveryNoteController.margin, DeliveryNoteController.margin + offset + height)
      .lineTo(DeliveryNoteController.margin, DeliveryNoteController.margin + offset)
      .stroke();
    myDoc.font('Helvetica')
      .fontSize(24)
      .text("Lieferschein", DeliveryNoteController.margin + DeliveryNoteController.padding, DeliveryNoteController.margin + offset + DeliveryNoteController.padding)
      .fontSize(14)
      .text("Bestellnummer: " + order.id)
      .text("Bestellung von:", addressColumnRight, DeliveryNoteController.margin + offset + DeliveryNoteController.padding + 10)
      .text(DeliveryNoteController.formatDate(order.date) + " " + DeliveryNoteController.formatTime(order.date), addressColumnRight, DeliveryNoteController.margin + offset + DeliveryNoteController.padding + 30)
      .text(order.user.prename + " " + order.user.name, addressColumnRight, DeliveryNoteController.margin + offset + DeliveryNoteController.padding + 50)
      .text(order.user.phone, addressColumnRight, DeliveryNoteController.margin + offset + DeliveryNoteController.padding + 65)
      .text(order.user.email, addressColumnRight, DeliveryNoteController.margin + offset + DeliveryNoteController.padding + 80)

      .text(`Abholstandort: ${order.location.description}`, DeliveryNoteController.margin + DeliveryNoteController.padding, DeliveryNoteController.margin + offset + DeliveryNoteController.padding + 50)
      .text("    am " + DeliveryNoteController.formatDate(order.plannedCheckout.fromDate)
        + " geöffnet von: " + DeliveryNoteController.formatTime(order.plannedCheckout.fromDate)
        + " bis: " + DeliveryNoteController.formatTime(order.plannedCheckout.toDate))
      .text(`Bestellte Artikel`, DeliveryNoteController.margin + DeliveryNoteController.padding, DeliveryNoteController.margin + offset + DeliveryNoteController.padding + 95)
      .moveTo(DeliveryNoteController.margin + DeliveryNoteController.padding, DeliveryNoteController.margin + offset + DeliveryNoteController.padding + 115)
      .lineTo(DeliveryNoteController.margin + width - DeliveryNoteController.padding, DeliveryNoteController.margin + offset + DeliveryNoteController.padding + 115)
      .stroke();
    let yCurrentLine = DeliveryNoteController.margin + offset + DeliveryNoteController.padding + 120;
    for (const item of order.orderItems) {
      myDoc.text(item.quantity.toFixed(1), DeliveryNoteController.margin + DeliveryNoteController.padding, yCurrentLine, {
        width: DeliveryNoteController.convert(13),
        align: 'right',
      })
        .text(item.article.unitOfMeasurement.shortcut, DeliveryNoteController.margin + DeliveryNoteController.padding + DeliveryNoteController.convert(15), yCurrentLine, {
          width: DeliveryNoteController.convert(8),
        });
      myDoc.text(item.article.description, DeliveryNoteController.margin + DeliveryNoteController.padding + DeliveryNoteController.convert(25), yCurrentLine, {
        width: DeliveryNoteController.convert(70),
      });
      myDoc.text((item.copiedPrice).toFixed(2) + " CHF/" + item.article.unitOfMeasurement.shortcut,
        DeliveryNoteController.margin + DeliveryNoteController.padding + DeliveryNoteController.convert(95), yCurrentLine, {
        width: DeliveryNoteController.convert(40),
        align: "right"
      });
      myDoc.text((item.copiedPrice * item.quantity).toFixed(2) + " CHF", DeliveryNoteController.margin + DeliveryNoteController.padding + DeliveryNoteController.convert(130), yCurrentLine, {
        width: DeliveryNoteController.convert(39),
        align: 'right'
      });
      yCurrentLine = yCurrentLine + DeliveryNoteController.convert(6);
    }
    const yTotalLine = DeliveryNoteController.margin + offset + DeliveryNoteController.padding + 235;
    myDoc.moveTo(DeliveryNoteController.margin + DeliveryNoteController.padding, yTotalLine - 5).lineTo(DeliveryNoteController.margin + width - DeliveryNoteController.padding, yTotalLine - 5).stroke();
    myDoc.fontSize(16)
      .text("Gesamtpreis Bestellung:", DeliveryNoteController.margin + DeliveryNoteController.padding, yTotalLine, { width: DeliveryNoteController.convert(105) })
      .font("Helvetica-Bold")
      .text((order.totalPrice).toFixed(2) + " CHF", DeliveryNoteController.margin + DeliveryNoteController.padding + DeliveryNoteController.convert(130), yTotalLine, {
        width: DeliveryNoteController.convert(39),
        align: 'right',
      });
    myDoc.moveTo(DeliveryNoteController.margin + DeliveryNoteController.padding, yTotalLine + 18).lineTo(DeliveryNoteController.margin + width - DeliveryNoteController.padding, yTotalLine + 18).stroke()
      .font('Helvetica')
      .fontSize(14);
    if (order.comment) {
      myDoc.text("Bestellkommentar:", DeliveryNoteController.margin + DeliveryNoteController.padding, DeliveryNoteController.margin + offset + DeliveryNoteController.padding + 263)
        .font("Helvetica-Bold")
        .text(order.comment, DeliveryNoteController.margin + DeliveryNoteController.padding, DeliveryNoteController.margin + offset + DeliveryNoteController.padding + 280, {
          width: DeliveryNoteController.convert(176),
          height: 80
        })
    }
    myDoc.fontSize(10)
      .font('Helvetica')
      .text("Lieferschein erstellt am " + DeliveryNoteController.formatDate(new Date()) + " um " + DeliveryNoteController.formatTime(new Date())
        + " von " + currentUser.prename + " " + currentUser.name, DeliveryNoteController.margin + DeliveryNoteController.padding, DeliveryNoteController.margin + offset + height - 13);
  }

  private static convert(mm: number): number {
    return mm / (25.4 / 72);
  }

  private static async getOrder(manager: EntityManager, orderId: number): Promise<OrderDto> {
    return await manager.getRepository(Order).findOne({
      where: { id: orderId },
      relations: [
        "user",
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

  private static formatDate(date: Date): string {
    return DateTime.fromJSDate(date).toFormat('dd.LL.yyyy');
  }

  private static formatTime(date: Date): string {
    return DateTime.fromJSDate(date).toLocal().toFormat('HH:mm');
  }

}
