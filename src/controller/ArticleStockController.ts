import { ArticleStockDto } from "citrus-common";
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { ArticleStockConverter } from "../converter/ArticleStockConverter";
import { ArticleStock } from "../entity/ArticleStock";

@JsonController("/api/articleStock")
export class ArticleStockController {
  private articleStockRepo: (manager: EntityManager) => Repository<ArticleStock>;

  constructor() {
    this.articleStockRepo = manager => manager.getRepository(ArticleStock);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public async get(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<ArticleStockDto> {
    return ArticleStockConverter.toDto(await this.articleStockRepo(manager).findOne(id));
  }

  @Transaction()
  @Get()
  public async getAll(@TransactionManager() manager: EntityManager): Promise<ArticleStockDto[]> {
    return ArticleStockConverter.toDtos(await this.articleStockRepo(manager).find({
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withArticle/:id([0-9]+)")
  public async getWithStock(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<ArticleStockDto> {
    return ArticleStockConverter.toDto(await this.articleStockRepo(manager).findOne(id, { relations: ["article"] }));
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withArticle")
  public async getAllWithStock(@TransactionManager() manager: EntityManager): Promise<ArticleStockDto[]> {
    return ArticleStockConverter.toDtos(await this.articleStockRepo(manager).find({
      relations: ["article"],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll/:id([0-9]+)")
  public async getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<ArticleStockDto> {
    return ArticleStockConverter.toDto(await this.articleStockRepo(manager).findOne(id, {
      relations: ["article", "article.unitOfMeasurement",
        "checkIns", "checkOuts", "location"],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Authorized(["admin", "store"])
  @Get("/withAll")
  public async getAllWithAll(@TransactionManager() manager: EntityManager): Promise<ArticleStockDto[]> {
    return ArticleStockConverter.toDtos(await this.articleStockRepo(manager).find({
      relations: ["article", "article.unitOfMeasurement",
        "checkIns", "checkOuts", "location"],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Authorized("admin")
  @Post("/withAll")
  public async saveWithAll(@TransactionManager() manager: EntityManager, @Body() articleStock: ArticleStock): Promise<ArticleStockDto> {
    const a = ArticleStockConverter.toEntity(articleStock);
    return ArticleStockConverter.toDto(await this.articleStockRepo(manager).save(a));
  }

  @Transaction()
  @Authorized("admin")
  @Put("/withAll/:id([0-9]+)")
  public async updateWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changeArticleStock: ArticleStock): Promise<ArticleStockDto> {
    const a = ArticleStockConverter.toEntity(changeArticleStock);
    a.id = +id;
    return ArticleStockConverter.toDto(await this.articleStockRepo(manager).save(a));
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/withAll/:id([0-9]+)")
  public async deleteWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<ArticleStockDto> {
    const articleStock = new ArticleStock();
    articleStock.id = +id;
    return ArticleStockConverter.toDto(await this.articleStockRepo(manager).remove(articleStock));
  }

  @Transaction()
  @Authorized("admin")
  @Post()
  public async save(@TransactionManager() manager: EntityManager, @Body() articleStock: ArticleStock) : Promise<ArticleStockDto>{
    const a = ArticleStockConverter.toEntity(articleStock);
    return ArticleStockConverter.toDto(await this.articleStockRepo(manager).save(a));
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<ArticleStockDto> {
    const articleStock = new ArticleStock();
    articleStock.id = +id;
    return ArticleStockConverter.toDto(await this.articleStockRepo(manager).remove(articleStock));
  }
}
