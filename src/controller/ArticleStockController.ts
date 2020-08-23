import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {ArticleStock} from "../entity/ArticleStock";

@JsonController("/api/articleStock")
export class ArticleStockController {
  private articleStockRepo: (manager: EntityManager) => Repository<ArticleStock>;

  constructor() {
    this.articleStockRepo = manager => manager.getRepository(ArticleStock);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public get(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.articleStockRepo(manager).findOne(id);
  }

  @Transaction()
  @Get()
  public getAll(@TransactionManager() manager: EntityManager) {
    return this.articleStockRepo(manager).find({
      order: {
        id: "ASC"
      },
    });
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withArticle/:id([0-9]+)")
  public getWithStock(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.articleStockRepo(manager).findOne(id, {relations: ["article"]});
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withArticle")
  public getAllWithStock(@TransactionManager() manager: EntityManager) {
    return this.articleStockRepo(manager).find({
      relations: ["article"],
      order: {
        id: "ASC"
      },
    });
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.articleStockRepo(manager).findOne(id, {
      relations: ["article", "article.unitOfMeasurement",
        "checkIns", "checkOuts", "location"],
      order: {
        id: "ASC"
      },
    });
  }

  @Transaction()
  @Authorized(["admin", "store"])
  @Get("/withAll")
  public getAllWithAll(@TransactionManager() manager: EntityManager) {
    return this.articleStockRepo(manager).find({
      relations: ["article", "article.unitOfMeasurement",
        "checkIns", "checkOuts", "location"],
      order: {
        id: "ASC"
      },
    });
  }

  @Transaction()
  @Authorized("admin")
  @Post("/withAll")
  public saveWithAll(@TransactionManager() manager: EntityManager, @EntityFromBody() articleStock: ArticleStock) {
    return this.articleStockRepo(manager).save(articleStock);
  }

  @Transaction()
  @Authorized("admin")
  @Put("/withAll/:id([0-9]+)")
  public updateWithAll(@TransactionManager() manager: EntityManager,
                       @EntityFromParam("id") articleStock: ArticleStock,
                       @EntityFromBody() changeArticleStock: ArticleStock) {
    return this.articleStockRepo(manager).save(this.articleStockRepo(manager).merge(articleStock, changeArticleStock));
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/withAll/:id([0-9]+)")
  public deleteWithAll(@TransactionManager() manager: EntityManager, @EntityFromParam("id") articleStock: ArticleStock) {
    return this.articleStockRepo(manager).remove(articleStock);
  }

  @Transaction()
  @Authorized("admin")
  @Post()
  public save(@TransactionManager() manager: EntityManager, @EntityFromBody() articleStock: ArticleStock) {
    return this.articleStockRepo(manager).save(articleStock);
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager, @EntityFromParam("id") articleStock: ArticleStock) {
    return this.articleStockRepo(manager).remove(articleStock);
  }
}
