import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";
import {Article} from "../models/Article";
import {UnitOfMeasurement} from "../models/UnitOfMeasurement";
import {IModelWrapper} from "./IModelWrapper";

export class ArticleInSaleModelWrapper implements IModelWrapper<Article> {

  public name() {
    return "ArticleInSale";
  }

  public create(article: Article, transaction: Transaction): Promise<Article> {
    throw new Error("Operation not permitted");
  }

  public findAll(transaction: Transaction): Promise<Article[]> {
    return Article.findAll({
      include: [UnitOfMeasurement],
      transaction,
      where: {inSale: true},
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: Article[]; count: number; }> {
    return Article.findAndCountAll({
      include: [UnitOfMeasurement],
      transaction,
      where: {inSale: true},
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<Article> {
    throw new Error("Operation not permitted");
  }

  public update(article: Article, transaction: Transaction): Promise<[number, Article[]]> {
    throw new Error("Operation not permitted");
  }

  public delete(value: Article, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }
}
