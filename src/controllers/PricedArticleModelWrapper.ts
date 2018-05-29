import * as Promise from "bluebird";
import {Article} from "../models/Article";
import {PricedArticle} from "../models/PricedArticle";
import {UnitOfMeasurement} from "../models/UnitOfMeasurement";
import {IModelWrapper} from "./IModelWrapper";

export class PricedArticleModelWrapper implements IModelWrapper<PricedArticle> {

  public name() {
    return "PricedArticle";
  }

  public create(value: PricedArticle): Promise<PricedArticle> {
    return PricedArticle.create(value);
  }

  public findAll(): Promise<PricedArticle[]> {
    return PricedArticle.findAll({
      include: [{
        model: Article,
        include: [UnitOfMeasurement],
      }],
    });
  }

  public findAndCountAll(): Promise<{ rows: PricedArticle[]; count: number; }> {
    return PricedArticle.findAndCountAll({
      include: [{
        model: Article,
        include: [UnitOfMeasurement],
      }],
    });
  }

  public findById(identifier?: string | number): Promise<PricedArticle> {
    return PricedArticle.findById(identifier, {
      include: [{
        model: Article,
        include: [UnitOfMeasurement],
      }],
    });
  }

  public update(value: PricedArticle): Promise<[number, PricedArticle[]]> {
    return PricedArticle.update(value, {where: {id: value.id}});
  }

}
