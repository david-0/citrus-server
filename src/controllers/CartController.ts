import {CartDto} from "citrus-common/lib/dto/cart-dto";
import {CartEntryDto} from "citrus-common/lib/dto/cart-entry-dto";
import * as express from "express";
import {Logger} from "log4js";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/map";
import "rxjs/add/operator/reduce";
import "rxjs/add/operator/mergeMap";
import {Observable} from "rxjs/Observable";
import {Subscriber} from "rxjs/src/Subscriber";
import {Transaction} from "sequelize";
import {Sequelize} from "sequelize-typescript";
import {Article} from "../models/Article";
import {CustomerOrder} from "../models/CustomerOrder";
import {CustomerOrderItem} from "../models/CustomerOrderItem";
import {User} from "../models/User";
import {IController} from "./IController";
import Promise = require("bluebird");
import log4js = require("log4js");

const LOGGER: Logger = log4js.getLogger("CartController");

export class CartController implements IController {

  constructor(private sequelize: Sequelize) {

  }

  public add(req: express.Request, res: express.Response): void {
    const cartDto = req.body;
    this.findUserByEmail(req.user.email)
      .mergeMap((user) => this.createOrder(cartDto, user))
      .subscribe((customerOrder) => {
        cartDto.id = customerOrder.id;
        LOGGER.debug(JSON.stringify(cartDto));
        res.json(cartDto);
      }, (err) => {
        res.status(500).json({error: `could not create order: ${err.error}`});
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

  private findUserByEmail(email: string): Observable<User> {
    return Observable.fromPromise(User.findOne({where: {email}}));
  }

  // private createOrder(cartDto: CartDto, user: User): Observable<CustomerOrder> {
  //   return Observable.fromPromise(this.createOrderPromise(cartDto, user));
  // }

  private createOrder(cartDto: CartDto, user: User): Observable<CustomerOrder> {
    return Observable.create((observer: Subscriber<CustomerOrder>) => {
      this.sequelize.transaction()
        .then((transaction) => {
          this.getAllArticles(transaction)
            .then((articles: Article[]) => {
              const order = this.createCustomerOrder(user.id, cartDto);
              order.save({transaction})
                .then((newOrder) => {
                  Promise.all(this.createOrderItems(cartDto, articles, newOrder.id)
                    .map((item) => item.save({transaction})))
                    .then((savedItems) => {
                      this.updateTotalPrice(newOrder, savedItems)
                        .save({transaction})
                        .then((savedOrder) => {
                          transaction.commit();
                          observer.next(savedOrder);
                        })
                        .catch((err) => {
                          transaction.rollback();
                          observer.error(err);
                        });
                    })
                    .catch((err) => {
                      transaction.rollback();
                      observer.error(err);
                    });
                })
                .catch((err) => {
                  transaction.rollback();
                  observer.error(err);
                });
            })
            .catch((err) => {
              transaction.rollback();
              observer.error(err);
            });
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }

  private getAllArticles(t: Transaction): Promise<Article[]> {
    return Article.findAll({transaction: t});
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

  private updateTotalPrice(order: CustomerOrder, items: CustomerOrderItem[]): CustomerOrder {
    order.totalPrice = items.reduce((previous, x) => previous + (+x.copiedPrice * +x.quantity), 0.0);
    return order;
  }

  private createOrderItem(entry: CartEntryDto, customerOrderId: number, articles: Article[]): CustomerOrderItem {
    const item = new CustomerOrderItem();
    item.customerOrderId = customerOrderId;
    item.articleId = entry.articleId;
    item.copiedPrice = entry.price;
    item.quantity = entry.quantity;
    return item;
  }

}
