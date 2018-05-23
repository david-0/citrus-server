import * as Promise from "bluebird";
import {UpdateOptions} from "sequelize";
import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import {Article} from "../models/Article";
import {IModelWrapper} from "./IModelWrapper";

export class ArticleModelWrapper implements IModelWrapper<Article> {

  public name() {
    return "Article";
  }

  public create(values?: any, options?: ICreateOptions): Promise<Article> {
    return Article.create(values, options);
  }

  public findAll(options?: IFindOptions<Article>): Promise<Article[]> {
    return Article.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions<Article>): Promise<{ rows: Article[]; count: number; }> {
    return Article.findAndCountAll();
  }

  public findById(identifier?: string | number, options?: IFindOptions<Article>): Promise<Article> {
    return Article.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, Article[]]> {
    return Article.update(values, options);
  }

}
