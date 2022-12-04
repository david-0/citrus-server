import { ArticleCheckInDto } from "citrus-common";
import { getLogger, Logger } from "log4js";
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { ArticleCheckInConverter } from "../converter/ArticleCheckInConverter";
import { ArticleCheckIn } from "../entity/ArticleCheckIn";

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
  public async getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<ArticleCheckInDto> {
    return ArticleCheckInConverter.toDto(await this.articleCheckInRepo(manager).findOne(id, {
      relations: [
        "articleStock",
        "articleStock.article",
        "articleStock.article.unitOfMeasurement",
        "articleStock.location",
        "doneUser",
      ],
    }));
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll")
  public async getAllWithAll(@TransactionManager() manager: EntityManager): Promise<ArticleCheckInDto[]> {
    return ArticleCheckInConverter.toDtos(await this.articleCheckInRepo(manager).find({
      relations: [
        "articleStock",
        "articleStock.article",
        "articleStock.article.unitOfMeasurement",
        "articleStock.location",
        "doneUser",
      ],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Authorized(["admin", "store"])
  @Post("/withAll")
  public async save(@TransactionManager() manager: EntityManager, @Body() article: ArticleCheckIn, @CurrentUser({ required: true }) userId: number): Promise<ArticleCheckInDto> {
    const a = ArticleCheckInConverter.toEntity(article);
    return ArticleCheckInConverter.toDto(await this.articleCheckInRepo(manager).save(a, { data: userId }));
  }

  @Transaction()
  @Authorized("admin")
  @Put("/withAll/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changeArticleCheckIn: ArticleCheckIn, @CurrentUser({ required: true }) userId: number): Promise<ArticleCheckInDto> {
    const a = ArticleCheckInConverter.toEntity(changeArticleCheckIn);
    a.id = +id;
    return ArticleCheckInConverter.toDto(await this.articleCheckInRepo(manager).save(a));
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/withAll/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number, @CurrentUser({ required: true }) userId: number): Promise<ArticleCheckInDto> {
    const checkIn = new ArticleCheckIn();
    checkIn.id = +id;
    return ArticleCheckInConverter.toDto(await this.articleCheckInRepo(manager).remove(checkIn, { data: userId }));
  }
}
