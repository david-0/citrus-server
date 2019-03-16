import {getLogger, Logger} from "log4js";
import {Authorized, CurrentUser, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {ArticleCheckIn} from "../entity/ArticleCheckIn";

@JsonController("/api/articleCheckIn")
export class ArticleCheckInController {
  private LOGGER: Logger = getLogger("ArticleCheckInController");
  private articleCheckInRepo: (manager: EntityManager) => Repository<ArticleCheckIn>;

  constructor() {
    this.articleCheckInRepo = manager => manager.getRepository(ArticleCheckIn);
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll/:id([0-9]+)")
  public async getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return await this.articleCheckInRepo(manager).findOne(id, {
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
  public async getAllWithAll(@TransactionManager() manager: EntityManager) {
    return await this.articleCheckInRepo(manager).find({
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
    this.LOGGER.info("before save");
    const result = await this.articleCheckInRepo(manager).save(article, {data: userId});
    this.LOGGER.info("after save");
    return result;
  }

  @Transaction()
  @Authorized("admin")
  @Put("/withAll/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager,
                      @EntityFromParam("id") articleCheckIn: ArticleCheckIn,
                      @EntityFromBody() changeArticleCheckIn: ArticleCheckIn,
                      @CurrentUser({required: true}) userId: number) {
    return await this.articleCheckInRepo(manager).save(
      await this.articleCheckInRepo(manager).merge(articleCheckIn, changeArticleCheckIn), {data: userId},
    );
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/withAll/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager,
                      @EntityFromParam("id") article: ArticleCheckIn,
                      @CurrentUser({required: true}) userId: number) {
    return await this.articleCheckInRepo(manager).remove(article, {data: userId});
  }
}
