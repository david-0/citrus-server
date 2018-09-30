import {CartDto} from "citrus-common/lib/dto/cart-dto";
import {CartEntryDto} from "citrus-common/lib/dto/cart-entry-dto";
import * as express from "express";
import {Logger} from "log4js";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";

import {Article} from "../models/Article";
import {CustomerOrder} from "../models/CustomerOrder";
import {CustomerOrderItem} from "../models/CustomerOrderItem";
import {User} from "../models/User";
import {CustomerOrderItemModelWrapper} from "./CustomerOrderItemModelWrapper";
import {ITransactionController} from "./ITransactionController";
import log4js = require("log4js");

const LOGGER: Logger = log4js.getLogger("CartController");

export class CartController implements ITransactionController {

  constructor(private itemWrapper: CustomerOrderItemModelWrapper) {
  }

  public add(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const cartDto = req.body;
      this.saveOrder(req.user.email, cartDto, transaction).then((orderId) => {
        cartDto.id = orderId;
        LOGGER.debug(JSON.stringify(cartDto));
        res.json(cartDto);
        resolve();
      }).catch((error) => {
        res.status(500).json({error: `could not create order: ${error.error}`});
        reject(error);
      });
    });
  }

  public getAll(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => reject());
  }

  public get(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => reject());
  }

  public del(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => reject());
  }

  public update(req: express.Request, res: express.Response, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => reject());
  }

  private saveOrder(email: string, cart: CartDto, transaction: Transaction): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const userPromise = User.findOne({where: {email}, transaction});
      const articlePromise = Article.findAll({transaction});
      Promise.all([userPromise, articlePromise]).then((results) => {
        const user = results[0];
        const articles = results[1];
        const order = this.createCustomerOrder(user.id);
        order.save({transaction}).then((newOrder: CustomerOrder) => {
          const items = this.createOrderItems(cart, articles, newOrder.id);
          this.saveItems(items, transaction).then((savedItems) => {
            this.updateTotalPrice(newOrder, savedItems, transaction)
              .then(() => resolve(newOrder.id))
              .catch((error) => reject(error));
          }).catch((error) => reject(error));
        }).catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }

  private updateTotalPrice(order: CustomerOrder, items: CustomerOrderItem[], transaction: Transaction): Promise<CustomerOrder> {
    order.totalPrice = items.map((item) => this.computePrice(item)).reduce((p, c) => p + c, 0);
    return new Promise<CustomerOrder>((resolve, reject) => {
      order.save({transaction})
        .then((updatedOrder) => resolve(updatedOrder))
        .catch((error) => reject(error));
    });
  }

  private computePrice(item: CustomerOrderItem) {
    return +item.copiedPrice * +item.quantity;
  }

  private createCustomerOrder(userId: number): CustomerOrder {
    const customerOrder = new CustomerOrder();
    customerOrder.userId = userId;
    customerOrder.date = new Date();
    return customerOrder;
  }

  private createOrderItems(cartDto: CartDto, articles: Article[], orderId: number): CustomerOrderItem[] {
    return cartDto.cartEntries.map((entry) => this.createOrderItem(entry, orderId, articles));
  }

  private createOrderItem(entry: CartEntryDto, orderId: number, articles: Article[]): CustomerOrderItem {
    const item = new CustomerOrderItem();
    item.customerOrderId = orderId;
    item.articleStockId = entry.articleStockId;
    item.copiedPrice = entry.price;
    item.quantity = entry.quantity;
    return item;
  }

  private saveItems(items: CustomerOrderItem[], transaction: Transaction): Promise<CustomerOrderItem[]> {
    return Promise.all(items.map((item) => this.itemWrapper.create(item, transaction)));
  }
}
