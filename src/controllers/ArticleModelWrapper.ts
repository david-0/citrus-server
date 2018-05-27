import * as Promise from "bluebird";
import {Article} from "../models/Article";
import {IModelWrapper} from "./IModelWrapper";

export class ArticleModelWrapper implements IModelWrapper<Article> {

  public name() {
    return "Article";
  }

  public create(value: Article): Promise<Article> {
    return Article.create(value);
  }

  public findAll(): Promise<Article[]> {
    return Article.findAll();
  }

  public findAndCountAll(): Promise<{ rows: Article[]; count: number; }> {
    return Article.findAndCountAll();
  }

  public findById(identifier?: string | number): Promise<Article> {
    return Article.findById(identifier);
  }

  public update(value: Article): Promise<[number, Article[]]> {
    return Article.update(value, {where: {id: value.id}});
  }

}
