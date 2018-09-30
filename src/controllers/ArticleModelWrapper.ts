import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";
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
      include: [UnitOfMeasurement],
      transaction,
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: Article[]; count: number; }> {
    return Article.findAndCountAll({
      include: [UnitOfMeasurement],
      transaction,
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<Article> {
    return Article.findById(identifier, {
      include: [UnitOfMeasurement],
      transaction,
    });
  }

  public update(article: Article, transaction: Transaction): Promise<[number, Article[]]> {
    return Article.update(article, {transaction, where: {id: article.id}});
  }

  public delete(value: Article, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }

}
