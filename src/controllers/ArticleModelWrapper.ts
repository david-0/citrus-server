import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {Article} from "../models/Article";
import {UnitOfMeasurement} from "../models/UnitOfMeasurement";
import {IModelWrapper} from "./IModelWrapper";

export class ArticleModelWrapper implements IModelWrapper<Article> {

  public name() {
    return "Article";
  }

  public create(article: Article, transaction: Transaction): Promise<Article> {
    return Article.create(article, {transaction});
  }

  public findAll(transaction: Transaction): Promise<Article[]> {
    return Article.findAll({
      transaction,
      include: [UnitOfMeasurement],
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: Article[]; count: number; }> {
    return Article.findAndCountAll({
      transaction,
      include: [UnitOfMeasurement],
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<Article> {
    return Article.findById(identifier, {
      transaction,
      include: [UnitOfMeasurement],
    });
  }

  public update(article: Article, transaction: Transaction): Promise<[number, Article[]]> {
    return Article.update(article, {transaction, where: {id: article.id}});
  }

}
