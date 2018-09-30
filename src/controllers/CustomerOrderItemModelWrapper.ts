import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";
import {ArticleStock} from "../models/ArticleStock";
import {CustomerOrder} from "../models/CustomerOrder";
import {CustomerOrderItem} from "../models/CustomerOrderItem";
import {IModelWrapper} from "./IModelWrapper";

export class CustomerOrderItemModelWrapper implements IModelWrapper<CustomerOrderItem> {

  public name() {
    return "CustomerOrderItem";
  }

  public create(item: CustomerOrderItem, transaction: Transaction): Promise<CustomerOrderItem> {
    return new Promise<CustomerOrderItem>((resolve, reject) => {
      let orderPromise = CustomerOrder.findById(item.customerOrderId, {transaction});
      let articleStockPromise = ArticleStock.findById(item.articleStockId, {transaction});
      Promise.all([orderPromise, articleStockPromise]).then((results) => {
        orderPromise = this.updateOrder(results[0], +item.copiedPrice * +item.quantity, transaction);
        articleStockPromise = this.updateArticleStock(results[1], +item.quantity, transaction);
        const itemPromise = this.updateItem(item, transaction);
        Promise.all([orderPromise, articleStockPromise, itemPromise])
          .then((res) => resolve(res[2]))
          .catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }

  public findAll(transaction: Transaction): Promise<CustomerOrderItem[]> {
    return CustomerOrderItem.findAll({transaction});
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: CustomerOrderItem[]; count: number; }> {
    return CustomerOrderItem.findAndCountAll({transaction});
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<CustomerOrderItem> {
    return CustomerOrderItem.findById(identifier, {transaction});
  }

  public update(item: CustomerOrderItem, transaction: Transaction): Promise<[number, Array<CustomerOrderItem>]> {
    return new Promise<[number, Array<CustomerOrderItem>]>((resolve, reject) => {
      this.findById(item.id, transaction).then((oldItem) => {
        let orderPromise = CustomerOrder.findById(item.customerOrderId, {transaction});
        let oldArticleStockPromise = ArticleStock.findById(oldItem.articleStockId, {transaction});
        Promise.all([orderPromise, oldArticleStockPromise]).then((results) => {
          orderPromise = this.updateOrder(results[0], this.computePriceDifference(item, oldItem), transaction);
          oldArticleStockPromise = this.updateArticleStock(results[1], -1 * +oldItem.quantity, transaction);
          Promise.all([orderPromise, oldArticleStockPromise]).then((res) => {
            ArticleStock.findById(item.articleStockId, {transaction}).then((article) => {
              const articleStockPromise = this.updateArticleStock(article, +item.quantity, transaction);
              const updateItemPromise = CustomerOrderItem.update(item, {where: {id: item.id}, transaction});
              Promise.all([articleStockPromise, updateItemPromise])
                .then((res2) => resolve(res2[1]))
                .catch((error) => reject(error));
            }).catch((error) => reject(error));
          }).catch((error) => reject(error));
        }).catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }

  public delete(item: CustomerOrderItem, transaction: Transaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let orderPromise = CustomerOrder.findById(item.customerOrderId, {transaction});
      let articleStockPromise = ArticleStock.findById(item.articleStockId, {transaction});
      Promise.all([orderPromise, articleStockPromise]).then((results) => {
        orderPromise = this.updateOrder(results[0], -1 * this.computePrice(item), transaction);
        articleStockPromise = this.updateArticleStock(results[1], -1 * +item.quantity, transaction);
        Promise.all([orderPromise, articleStockPromise]).then((res) => {
          item.destroy({transaction}).then(() => resolve()).catch((error) => reject(error));
        }).catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }

  private updateItem(item: CustomerOrderItem, transaction: Transaction): Promise<CustomerOrderItem> {
    if (item instanceof CustomerOrderItem) {
      return item.save({transaction});
    }
    return CustomerOrderItem.create(item, {transaction});
  }

  private updateOrder(order: CustomerOrder, priceDifference: number, transaction: Transaction): Promise<CustomerOrder> {
    order.totalPrice = +order.totalPrice + +priceDifference;
    return order.save({transaction});
  }

  private updateArticleStock(articleStock: ArticleStock, count: number, transaction: Transaction): Promise<ArticleStock> {
    articleStock.reservedQuantity = +articleStock.reservedQuantity + +count;
    return articleStock.save({transaction});
  }

  private computePriceDifference(item: CustomerOrderItem, oldItem: CustomerOrderItem): number {
    return this.computePrice(item) - this.computePrice(oldItem);
  }

  private computePrice(item: CustomerOrderItem) {
    return +item.copiedPrice * +item.quantity;
  }
}
