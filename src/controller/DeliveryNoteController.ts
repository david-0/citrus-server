// @ts-ignore
import { UserDto, OrderDto } from "citrus-common";
import * as express from "express";
import { Authorized, Body, CurrentUser, JsonController, Post, Req, Res } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { User } from "../entity/User";
import { MailService } from "../utils/MailService";
import { Order } from "../entity/Order";
import doc = require("pdfkit");
import * as moment from "moment-timezone";
import { of } from "rxjs";

@Authorized("admin")
@JsonController("/api/deliveryNote")
export class DeliveryNoteController {
  private mailService: MailService;

  private userRepo: (manager: EntityManager) => Repository<User>;
  private orderRepo: (manager: EntityManager) => Repository<Order>;

  private margin = 40;
  private padding = 10;

  constructor() {
    this.userRepo = manager => manager.getRepository(User);
    this.orderRepo = manager => manager.getRepository(Order);
  }

  @Post()
  @Transaction()
  public async returnDeliveryNote(@CurrentUser({ required: true }) userId: number,
    @TransactionManager() manager: EntityManager,
    @Req() request: express.Request,
    @Body() orderIds: number[],
    @Res() response: express.Response): Promise<any> {
    let currentUser: UserDto = await this.userRepo(manager).findOne(userId);
    response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    //    response.attachment("Lieferschein_" + orderIds.join(",") + ".pdf");
    response.attachment("Lieferschein.pdf");
    response.contentType('application/pdf');

    let myDoc = new doc({ bufferPages: true, autoFirstPage: false });
    myDoc.pipe(response);

    const currentDate = new Date();

    const orders = await this.loadOrders(orderIds, manager);
    orders.sort((a, b) => this.comparator(a,b)); 

    let lastLocationId = undefined;
    let page = 0;
    for (let order of orders) {
      await this.updateDeliveryDate(order, currentDate, manager);
      if (lastLocationId !== order.location.id && !this.isEven(page)) {
        page++;
      }
      if (this.isEven(+page)) {
        myDoc.addPage({
          margin: 0,
          size: [595, 839]
        });
        this.printContent(myDoc, order, 0, currentUser);
      } else {
        this.printContent(myDoc, order, 1, currentUser);
      }
      page++;
      lastLocationId = order.location.id;
    }
    myDoc.end();
    return;
  }

  private comparator(a: OrderDto, b: OrderDto ) {
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

  private async loadOrders(orderIds: number[], manager: EntityManager): Promise<OrderDto[]> {
    let result = [];
    for (let orderId of orderIds) {
      result.push(await this.getOrder(orderId, manager));
    }
    return result;
  }

  private isEven(n: number): boolean {
    return n % 2 == 0;
  }

  private async updateDeliveryDate(order: OrderDto, currentDate: Date, manager: EntityManager) {
    order.deliveryNoteCreated = currentDate;
    await this.orderRepo(manager).save(order);
  }

  private printContent(myDoc: PDFKit.PDFDocument, order: OrderDto, pagePart: number, currentUser: UserDto) {
    const widthA5 = this.convert(210);
    const width = widthA5 - 2 * this.margin;
    const heightA5 = this.convert(148);
    const height = heightA5 - 2 * this.margin;
    const offset = pagePart * heightA5;
    const addressColumnRight = this.margin + width - this.convert(65);

    myDoc.lineWidth(1) //
      .moveTo(this.margin, this.margin + offset)
      .lineTo(this.margin + width, this.margin + offset)
      .lineTo(this.margin + width, this.margin + offset + height)
      .lineTo(this.margin, this.margin + offset + height)
      .lineTo(this.margin, this.margin + offset)
      .stroke();
    myDoc.font('Helvetica')
      .fontSize(24)
      .text("Lieferschein", this.margin + this.padding, this.margin + offset + this.padding)
      .fontSize(14)
      .text("Bestellnummer: " + order.id)
      .text("Bestellung von:", addressColumnRight, this.margin + offset + this.padding + 10)
      .text(this.formatDate(order.date) + " " + this.formatTime(order.date), addressColumnRight, this.margin + offset + this.padding + 30)
      .text(order.user.prename + " " + order.user.name, addressColumnRight, this.margin + offset + this.padding + 50)
      .text(order.user.phone, addressColumnRight, this.margin + offset + this.padding + 65)
      .text(order.user.email, addressColumnRight, this.margin + offset + this.padding + 80)

      .text(`Abholstandort: ${order.location.description}`, this.margin + this.padding, this.margin + offset + this.padding + 50)
      .text("    am " + this.formatDate(order.plannedCheckout.fromDate)
        + " geöffnet von: " + this.formatTime(order.plannedCheckout.fromDate)
        + " bis: " + this.formatTime(order.plannedCheckout.toDate))
      .text(`Bestellte Artikel`, this.margin + this.padding, this.margin + offset + this.padding + 95)
      .moveTo(this.margin + this.padding, this.margin + offset + this.padding + 115)
      .lineTo(this.margin + width - this.padding, this.margin + offset + this.padding + 115)
      .stroke();
    let yCurrentLine = this.margin + offset + this.padding + 120;
    for (const item of order.orderItems) {
      myDoc.text(item.quantity.toFixed(1), this.margin + this.padding, yCurrentLine, {
        width: this.convert(13),
        align: 'right',
      })
        .text(item.article.unitOfMeasurement.shortcut, this.margin + this.padding + this.convert(15), yCurrentLine, {
          width: this.convert(8),
        });
      myDoc.text(item.article.description, this.margin + this.padding + this.convert(25), yCurrentLine, {
        width: this.convert(70),
      });
      myDoc.text((item.copiedPrice).toFixed(2) + " CHF/" + item.article.unitOfMeasurement.shortcut,
        this.margin + this.padding + this.convert(95), yCurrentLine, {
        width: this.convert(40),
        align: "right"
      });
      myDoc.text((item.copiedPrice * item.quantity).toFixed(2) + " CHF", this.margin + this.padding + this.convert(130), yCurrentLine, {
        width: this.convert(39),
        align: 'right'
      });
      yCurrentLine = yCurrentLine + this.convert(6);
    }
    const yTotalLine = this.margin + offset + this.padding + 235;
    myDoc.moveTo(this.margin + this.padding, yTotalLine - 5).lineTo(this.margin + width - this.padding, yTotalLine - 5).stroke();
    myDoc.fontSize(16)
      .text("Gesamtpreis Bestellung:", this.margin + this.padding, yTotalLine, { width: this.convert(105) })
      .font("Helvetica-Bold")
      .text((order.totalPrice).toFixed(2) + " CHF", this.margin + this.padding + this.convert(130), yTotalLine, {
        width: this.convert(39),
        align: 'right',
      });
    myDoc.moveTo(this.margin + this.padding, yTotalLine + 18).lineTo(this.margin + width - this.padding, yTotalLine + 18).stroke()
      .font('Helvetica')
      .fontSize(14);
    if (order.comment) {
      myDoc.text("Bestellkommentar:", this.margin + this.padding, this.margin + offset + this.padding + 263)
        .font("Helvetica-Bold")
        .text(order.comment, this.margin + this.padding, this.margin + offset + this.padding + 280, {
          width: this.convert(176),
          height: 80
        })
    }
    myDoc.fontSize(10)
      .font('Helvetica')
      .text("Lieferschein erstellt am " + this.formatDate(new Date()) + " um " + this.formatTime(new Date())
        + " von " + currentUser.prename + " " + currentUser.name, this.margin + this.padding, this.margin + offset + height - 13);
  }

  private convert(mm: number): number {
    return mm / (25.4 / 72);
  }

  private async getOrder(oderId: number, manager: EntityManager): Promise<OrderDto> {
    return this.orderRepo(manager).findOne(oderId, {
      relations: [
        "user",
        "location",
        "orderItems",
        "orderItems.article",
        "orderItems.article.unitOfMeasurement",
        "plannedCheckout",
        "checkingOutUser",
      ],
      order: {
        id: "ASC"
      },
    });
  }

  private formatDate(date: Date): string {
    return moment.utc(date).add(1, "hour").local().format("DD.MM.YYYY");
  }

  private formatTime(date: Date): string {
    return moment.utc(date).add(1, "hour").local().format("HH:mm");
  }
}
