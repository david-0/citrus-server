import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {ArticleCheckOut} from "../models/ArticleCheckOut";

@JsonController("/api/articleCheckOut")
export class ArticleCheckOutController {
  private articleCheckOutRepository: Repository<ArticleCheckOut>;

  constructor() {
    this.articleCheckOutRepository = getManager().getRepository(ArticleCheckOut);
  }

  @Authorized()
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@Param("id") id: number) {
    return this.articleCheckOutRepository.findOne(id, {
      relations: [
        "articleStock",
        "articleStock.article",
        "articleStock.article.unitOfMeasurement",
        "articleStock.location",
        "user",
      ],
    });
  }

  @Authorized()
  @Get("/withAll")
  public getAllWithAll() {
    return this.articleCheckOutRepository.find({
      relations: [
        "articleStock",
        "articleStock.article",
        "articleStock.article.unitOfMeasurement",
        "articleStock.location",
        "user",
      ],
    });
  }

  @Authorized()
  @Post("/withAll")
  public save(@EntityFromBody() article: ArticleCheckOut) {
    return this.articleCheckOutRepository.save(article);
  }

  @Authorized()
  @Put("/withAll/:id([0-9]+)")
  public update(@EntityFromParam("id") articleCheckOut: ArticleCheckOut, @EntityFromBody() changeArticleCheckOut: ArticleCheckOut) {
    return this.articleCheckOutRepository.save(this.articleCheckOutRepository.merge(articleCheckOut, changeArticleCheckOut));
  }

  @Authorized()
  @Delete("/withAll/:id([0-9]+)")
  public delete(@EntityFromParam("id") article: ArticleCheckOut) {
    return this.articleCheckOutRepository.remove(article);
  }
}
