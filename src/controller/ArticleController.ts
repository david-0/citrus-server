import { ArticleDto } from "citrus-common";
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { ArticleConverter } from "../converter/ArticleConverter";
import { Article } from "../entity/Article";

@JsonController("/api/article")
export class ArticleController {
  private articleRepo: (manager: EntityManager) => Repository<Article>;

  constructor() {
    this.articleRepo = manager => manager.getRepository(Article);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public async get(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<ArticleDto> {
    return ArticleConverter.toDto(await this.articleRepo(manager).findOne(id, { relations: ["unitOfMeasurement"] }));
  }

  @Transaction()
  @Get()
  public async getAll(@TransactionManager() manager: EntityManager): Promise<ArticleDto[]> {
    return ArticleConverter.toDtos(await this.articleRepo(manager).find({
      relations: ["unitOfMeasurement"],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Get("/inSale")
  public async getAllInSale(@TransactionManager() manager: EntityManager): Promise<ArticleDto[]> {
    return ArticleConverter.toDtos(await this.articleRepo(manager).find({
      relations: [
        "unitOfMeasurement",
        "articleStocks",
        "articleStocks.location",
        "articleStocks.article",
        "articleStocks.article.unitOfMeasurement",
      ],
      order: {
        id: "ASC"
      },
      where: { inSale: true },
    }));
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withStock/:id([0-9]+)")
  public async getWithStock(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<ArticleDto> {
    return ArticleConverter.toDto(await this.articleRepo(manager).findOne(id, {
      relations: [
        "unitOfMeasurement",
        "articleStocks",
        "articleStocks.location",
        "articleStocks.article",
        "articleStocks.article.unitOfMeasurement",
        "articleStocks.checkIns",
      ],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withStock")
  public async getAllWithStock(@TransactionManager() manager: EntityManager): Promise<ArticleDto[]> {
    return ArticleConverter.toDtos(await this.articleRepo(manager).find({
      relations: [
        "unitOfMeasurement",
        "articleStocks",
        "articleStocks.location",
        "articleStocks.article",
        "articleStocks.article.unitOfMeasurement",
        "articleStocks.checkIns",
      ],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Get("/withAll/:id([0-9]+)")
  public async getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<ArticleDto> {
    return ArticleConverter.toDto(await this.articleRepo(manager).findOne(id, {
      relations: [
        "unitOfMeasurement",
        "articleStocks",
        "articleStocks.location",
        "articleStocks.article",
        "articleStocks.article.unitOfMeasurement",
        "articleStocks.checkIns",
      ],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll")
  public async getAllWithAll(@TransactionManager() manager: EntityManager): Promise<ArticleDto[]> {
    return ArticleConverter.toDtos(await this.articleRepo(manager).find({
      relations: [
        "unitOfMeasurement",
        "articleStocks",
        "articleStocks.location",
        "articleStocks.article",
        "articleStocks.article.unitOfMeasurement",
        "articleStocks.checkIns",
      ],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/withAll/:id([0-9]+)")
  public async deleteWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<ArticleDto> {
    const article = new Article();
    article.id = +id;
    return ArticleConverter.toDto(await this.articleRepo(manager).remove(article));
  }

  @Transaction()
  @Authorized("admin")
  @Post()
  public async save(@TransactionManager() manager: EntityManager, @Body() article: Article): Promise<ArticleDto> {
    const a = ArticleConverter.toEntity(article);
    return ArticleConverter.toDto(await this.articleRepo(manager).save(a));
  }

  @Transaction()
  @Authorized("admin")
  @Put("/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() newArticle: Article): Promise<ArticleDto> {
    const a = ArticleConverter.toEntity(newArticle);
    a.id = +id;
    return ArticleConverter.toDto(await this.articleRepo(manager).save(a));
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<ArticleDto> {
    const article = new Article();
    article.id = +id;
    return ArticleConverter.toDto(await this.articleRepo(manager).remove(article));
  }
}
