import {Authorized, CurrentUser, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {ArticleCheckOut} from "../entity/ArticleCheckOut";

@JsonController("/api/articleCheckOut")
export class ArticleCheckOutController {
  private articleCheckOutRepo: (manager: EntityManager) => Repository<ArticleCheckOut>;

  constructor() {
    this.articleCheckOutRepo = manager => manager.getRepository(ArticleCheckOut);
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.articleCheckOutRepo(manager).findOne(id, {
      relations: [
        "articleStock",
        "articleStock.article",
        "articleStock.article.unitOfMeasurement",
        "articleStock.location",
        "doneUser",
      ],
    });
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll")
  public getAllWithAll(@TransactionManager() manager: EntityManager) {
    return this.articleCheckOutRepo(manager).find({
      relations: [
        "articleStock",
        "articleStock.article",
        "articleStock.article.unitOfMeasurement",
        "articleStock.location",
        "doneUser",
      ],
    });
  }

  @Transaction()
  @Authorized(["admin", "store"])
  @Post("/withAll")
  public save(@TransactionManager() manager: EntityManager,
              @EntityFromBody() article: ArticleCheckOut,
              @CurrentUser({required: true}) userId: number) {
    return this.articleCheckOutRepo(manager).save(article, {data: userId});
  }

  @Transaction()
  @Authorized("admin")
  @Put("/withAll/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager,
                      @EntityFromParam("id") articleCheckOut: ArticleCheckOut,
                      @EntityFromBody() changeArticleCheckOut: ArticleCheckOut,
                      @CurrentUser({required: true}) userId: number) {
    return await this.articleCheckOutRepo(manager).save(
      await this.articleCheckOutRepo(manager).merge(articleCheckOut, changeArticleCheckOut), {data: userId}
    );
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/withAll/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager,
                @EntityFromParam("id") article: ArticleCheckOut,
                @CurrentUser({required: true}) userId: number) {
    return this.articleCheckOutRepo(manager).remove(article, {data: userId});
  }
}
