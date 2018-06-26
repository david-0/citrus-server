import {CartDto} from "citrus-common/lib/dto/cart-dto";
import {CartEntryDto} from "citrus-common/lib/dto/cart-entry-dto";
import * as express from "express";
import {Logger} from "log4js";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/reduce";
import {Transaction} from "sequelize";
import {Sequelize} from "sequelize-typescript";
import {Article} from "../models/Article";
import {CustomerOrder} from "../models/CustomerOrder";
import {CustomerOrderItem} from "../models/CustomerOrderItem";
import {User} from "../models/User";
import {CustomerOrderItemModelWrapper} from "./CustomerOrderItemModelWrapper";
import {IController} from "./IController";
import Promise = require("bluebird");
import log4js = require("log4js");

const LOGGER: Logger = log4js.getLogger("CartController");

export class CartController implements IController {

  constructor(private sequelize: Sequelize,
              private itemWrapper: CustomerOrderItemModelWrapper) {
  }

  public add(req: express.Request, res: express.Response): void {
    const cartDto = req.body;
    this.saveOrderInTransaction(req.user.email, cartDto).then((orderId) => {
      cartDto.id = orderId;
      LOGGER.debug(JSON.stringify(cartDto));
      res.json(cartDto);
    }).catch((error) => {
      res.status(500).json({error: `could not create order: ${error.error}`});
    });
  }


  public getAll(req: express.Request, res: express.Response): void {
    // empty
  }

  public get(req: express.Request, res: express.Response): void {
    // empty
  }

  public del(req: express.Request, res: express.Response): void {
    // empty
  }

  public update(req: express.Request, res: express.Response): void {
    // empty
  }

  private saveOrderInTransaction(email: string, cart: CartDto): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.sequelize.transaction().then((transaction) => {
        this.saveOrder(email, cart, transaction).then((orderId) => {
          transaction.commit();
          resolve(orderId);
        }).catch((error) => {
          transaction.rollback();
          reject(error);
        });
      }).catch((error) => reject(error));
    });
  }

  private saveOrder(email: string, cart: CartDto, transaction: Transaction): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const userPromise = User.findOne({where: {email}, transaction});
      const articlePromise = Article.findAll({transaction});
      Promise.all([userPromise, articlePromise]).then((results) => {
        const user = results[0];
        const articles = results[1];
        const order = this.createCustomerOrder(user.id, cart);
        order.save({transaction}).then((newOrder: CustomerOrder) => {
          const items = this.createOrderItems(cart, articles, newOrder.id);
          this.saveItems(items, transaction)
            .then(() => resolve(newOrder.id))
            .catch((error) => reject(error));
        }).catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }

  private createCustomerOrder(userId: number, cartDto: CartDto): CustomerOrder {
    const customerOrder = new CustomerOrder();
    customerOrder.userId = userId;
    customerOrder.date = new Date();
    customerOrder.pickupLocationId = cartDto.pickupLocationId;
    return customerOrder;
  }

  private createOrderItems(cartDto: CartDto, articles: Article[], orderId: number): CustomerOrderItem[] {
    return cartDto.cartEntries.map((entry) => this.createOrderItem(entry, orderId, articles));
  }

  private createOrderItem(entry: CartEntryDto, orderId: number, articles: Article[]): CustomerOrderItem {
    const item = new CustomerOrderItem();
    item.customerOrderId = orderId;
    item.articleId = entry.articleId;
    item.copiedPrice = entry.price;
    item.quantity = entry.quantity;
    return item;
  }

  private saveItems(items: CustomerOrderItem[], transaction: Transaction): Promise<CustomerOrderItem[]> {
    return Promise.all(items.map((item) => this.itemWrapper.create(item, transaction)));
  }
}
