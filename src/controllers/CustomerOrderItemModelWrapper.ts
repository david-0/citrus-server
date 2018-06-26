import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {Article} from "../models/Article";
import {CustomerOrder} from "../models/CustomerOrder";
import {CustomerOrderItem} from "../models/CustomerOrderItem";
import {ArticleModelWrapper} from "./ArticleModelWrapper";
import {CustomerOrderModelWrapper} from "./CustomerOrderModelWrapper";
import {IModelWrapper} from "./IModelWrapper";

export class CustomerOrderItemModelWrapper implements IModelWrapper<CustomerOrderItem> {

  constructor(private orderWrapper: CustomerOrderModelWrapper,
              private articleWrapper: ArticleModelWrapper) {
  }

  public name() {
    return "CustomerOrderItem";
  }

  public create(item: CustomerOrderItem, transaction?: Transaction): Promise<CustomerOrderItem> {
    return new Promise<CustomerOrderItem>((resolve, reject) => {
      let orderPromise = this.orderWrapper.findById(item.customerOrderId, transaction);
      let articlePromise = this.articleWrapper.findById(item.articleId, transaction);
      Promise.all([orderPromise, articlePromise]).then((results) => {
        orderPromise = this.updateOrder(results[0], +item.copiedPrice * +item.quantity, transaction);
        articlePromise = this.updateArticle(results[1], +item.quantity, transaction);
        const itemPromise = this.updateItem(item, transaction);
        Promise.all([orderPromise, articlePromise, itemPromise])
          .then((results) => resolve(results[2]))
          .catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }

  private updateItem(item: CustomerOrderItem, transaction: Transaction): Promise<CustomerOrderItem> {
//    if (typeof (any)item === "CustomerOrderItem") {
    return item.save({transaction});
    // }
    // return CustomerOrderItem.create(item, {transaction});
  }

  private updateOrder(order: CustomerOrder, priceDifference: number, transaction: Transaction): Promise<CustomerOrder> {
    order.totalPrice = +order.totalPrice + +priceDifference;
    return order.save({transaction});
  }

  private updateArticle(article: Article, count: number, transaction: Transaction): Promise<Article> {
    article.reservedInOpenOrders = +article.reservedInOpenOrders + +count;
    return article.save({transaction});
  }

  public findAll(transaction?: Transaction): Promise<CustomerOrderItem[]> {
    return CustomerOrderItem.findAll({transaction});
  }

  public findAndCountAll(transaction?: Transaction): Promise<{ rows: CustomerOrderItem[]; count: number; }> {
    return CustomerOrderItem.findAndCountAll({transaction});
  }

  public findById(identifier?: string | number, transaction?: Transaction): Promise<CustomerOrderItem> {
    return CustomerOrderItem.findById(identifier, {transaction});
  }

  public update(item: CustomerOrderItem, transaction?: Transaction): Promise<[number, Array<CustomerOrderItem>]> {
    return new Promise<[number, Array<CustomerOrderItem>]>((resolve, reject) => {
      this.findById(item.id, transaction).then((oldItem) => {
        let orderPromise = this.orderWrapper.findById(item.customerOrderId, transaction);
        let oldArticlePromise = this.articleWrapper.findById(oldItem.articleId, transaction);
        let articlePromise = this.articleWrapper.findById(item.articleId, transaction);
        Promise.all([orderPromise, oldArticlePromise, articlePromise]).then((results) => {
          orderPromise = this.updateOrder(results[0], this.computePriceDifference(item, oldItem), transaction);
          oldArticlePromise = this.updateArticle(results[1], -1 * +item.quantity, transaction);
          articlePromise = this.updateArticle(results[2], +item.quantity, transaction);
          const updateItemPromise = CustomerOrderItem.update(item, {where: {id: item.id}, transaction});
          Promise.all([orderPromise, oldArticlePromise, articlePromise, updateItemPromise])
            .then((results) => resolve(results[3]))
            .catch((error) => reject(error));
        }).catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }

  private computePriceDifference(item: CustomerOrderItem, oldItem: CustomerOrderItem): number {
    const priceNewItems = +item.copiedPrice * +item.quantity;
    const priceOldItems = +oldItem.copiedPrice * +oldItem.quantity;
    return priceNewItems - priceOldItems;
  }
}
