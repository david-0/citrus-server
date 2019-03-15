import {Authorized, CurrentUser, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {ArticleCheckIn} from "../entity/ArticleCheckIn";

@JsonController("/api/articleCheckIn")
export class ArticleCheckInController {
  private articleCheckInRepo: (manager: EntityManager) => Repository<ArticleCheckIn>;

  constructor() {
    this.articleCheckInRepo = manager => manager.getRepository(ArticleCheckIn);
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.articleCheckInRepo(manager).findOne(id, {
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
    return this.articleCheckInRepo(manager).find({
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
  public async save(@TransactionManager() manager: EntityManager,
                    @EntityFromBody() article: ArticleCheckIn,
                    @CurrentUser({required: true}) userId: number) {
    return this.articleCheckInRepo(manager).save(article, {data: userId});
  }

  @Transaction()
  @Authorized("admin")
  @Put("/withAll/:id([0-9]+)")
  public update(@TransactionManager() manager: EntityManager,
                @EntityFromParam("id") articleCheckIn: ArticleCheckIn,
                @EntityFromBody() changeArticleCheckIn: ArticleCheckIn,
                @CurrentUser({required: true}) userId: number) {
    return this.articleCheckInRepo(manager).save(
      this.articleCheckInRepo(manager).merge(articleCheckIn, changeArticleCheckIn), {data: userId},
    );
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/withAll/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager,
                @EntityFromParam("id") article: ArticleCheckIn,
                @CurrentUser({required: true}) userId: number) {
    return this.articleCheckInRepo(manager).remove(article, {data: userId});
  }
}
