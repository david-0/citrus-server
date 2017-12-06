import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {Article} from "../models/Article";
import {PricedArticle} from "../models/PricedArticle";
import {IModelWrapper} from "./IModelWrapper";

export class PricedArticleModelWrapper implements IModelWrapper<PricedArticle> {

  public name() {
    return "PricedArticle";
  }

  public filterColumns(): string[] {
    return ["price", "validFrom", "validTo"];
  }

  public create(values?: any, options?: ICreateOptions): Promise<PricedArticle> {
    return PricedArticle.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<PricedArticle[]> {
    return PricedArticle.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: PricedArticle[]; count: number; }> {
    return PricedArticle.findAndCountAll(options);
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<PricedArticle> {
    return PricedArticle.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, PricedArticle[]]> {
    return PricedArticle.update(values, options);
  }

}
