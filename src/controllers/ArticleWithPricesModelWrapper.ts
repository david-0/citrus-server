import * as Promise from "bluebird";
import {Article} from "../models/Article";
import {UnitOfMeasurement} from "../models/UnitOfMeasurement";
import {User} from "../models/User";
import {IModelWrapper} from "./IModelWrapper";

export class ArticleWithPricesModelWrapper implements IModelWrapper<Article> {

  public name() {
    return "Article";
  }

  public create(value: Article): Promise<Article> {
    return Article.create(value);
  }

  public findAll(): Promise<Article[]> {
    return Article.findAll({
      include: [UnitOfMeasurement],
    });
  }

  public findAndCountAll(): Promise<{ rows: Article[]; count: number; }> {
    return Article.findAndCountAll({
      include: [UnitOfMeasurement],
    });
  }

  public findById(identifier?: string | number): Promise<Article> {
    return Article.findById(identifier, {
      include: [UnitOfMeasurement],
    });
  }

  public update(value: Article): Promise<[number, Article[]]> {
    return Article.update(value, {where: {id: value.id}});
  }

}
