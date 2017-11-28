import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {Article} from "../models/Article";
import {IModelWrapper} from "./IModelWrapper";

export class ArticleModelWrapper implements IModelWrapper<Article> {

  public name() {
    return "Article";
  }

  public filterColumns(): string[] {
    return ["number", "description", "price", "amount"];
  }

  public create(values?: any, options?: ICreateOptions): Promise<Article> {
    return Article.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<Article[]> {
    return Article.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: Article[]; count: number; }> {
    return Article.findAndCountAll(options);
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<Article> {
    return Article.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, Article[]]> {
    return Article.update(values, options);
  }

}
