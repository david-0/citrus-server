import { ArticleCheckOutDto } from "citrus-common";
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { ArticleCheckOutConverter } from "../converter/ArticleCheckOutConverter";
import { ArticleCheckOut } from "../entity/ArticleCheckOut";

@JsonController("/api/articleCheckOut")
export class ArticleCheckOutController {
  private articleCheckOutRepo: (manager: EntityManager) => Repository<ArticleCheckOut>;

  constructor() {
    this.articleCheckOutRepo = manager => manager.getRepository(ArticleCheckOut);
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll/:id([0-9]+)")
  public async getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<ArticleCheckOutDto> {
    return ArticleCheckOutConverter.toDto(await this.articleCheckOutRepo(manager).findOne(id, {
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
  public async getAllWithAll(@TransactionManager() manager: EntityManager): Promise<ArticleCheckOutDto[]> {
    return ArticleCheckOutConverter.toDtos(await this.articleCheckOutRepo(manager).find({
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
  public async save(@TransactionManager() manager: EntityManager, @Body() article: ArticleCheckOut, @CurrentUser({ required: true }) userId: number): Promise<ArticleCheckOutDto> {
    const a = ArticleCheckOutConverter.toEntity(article);
    return ArticleCheckOutConverter.toDto(await this.articleCheckOutRepo(manager).save(a, { data: userId }));
  }

  @Transaction()
  @Authorized("admin")
  @Put("/withAll/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changeArticleCheckOut: ArticleCheckOut, @CurrentUser({ required: true }) userId: number): Promise<ArticleCheckOutDto> {
    const a = ArticleCheckOutConverter.toEntity(changeArticleCheckOut);
    a.id = +id;
    return ArticleCheckOutConverter.toDto(await this.articleCheckOutRepo(manager).save(a));
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/withAll/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number, @CurrentUser({ required: true }) userId: number): Promise<ArticleCheckOutDto> {
    const checkOut = new ArticleCheckOut();
    checkOut.id = +id;
    return ArticleCheckOutConverter.toDto(await this.articleCheckOutRepo(manager).remove(checkOut, { data: userId }));
  }
}
