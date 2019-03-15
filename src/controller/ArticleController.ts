import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Article} from "../entity/Article";

@JsonController("/api/article")
export class ArticleController {
  private articleRepo: (manager: EntityManager) => Repository<Article>;

  constructor() {
    this.articleRepo = manager => manager.getRepository(Article);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public get(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.articleRepo(manager).findOne(id, {relations: ["unitOfMeasurement"]});
  }

  @Transaction()
  @Get()
  public getAll(@TransactionManager() manager: EntityManager) {
    return this.articleRepo(manager).find({relations: ["unitOfMeasurement"]});
  }

  @Transaction()
  @Get("/inSale")
  public getAllInSale(@TransactionManager() manager: EntityManager) {
    return this.articleRepo(manager).find({
      relations: [
        "unitOfMeasurement",
        "articleStocks",
        "articleStocks.location",
        "articleStocks.article",
        "articleStocks.article.unitOfMeasurement",
      ],
      where: {inSale: true},
    });
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withStock/:id([0-9]+)")
  public getWithStock(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.articleRepo(manager).findOne(id, {relations: ["unitOfMeasurement", "articleStocks"]});
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withStock")
  public getAllWithStock(@TransactionManager() manager: EntityManager,) {
    return this.articleRepo(manager).find({relations: ["unitOfMeasurement", "articleStocks"]});
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.articleRepo(manager).findOne(id, {relations: ["unitOfMeasurement", "articleStocks"]});
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll")
  public getAllWithAll(@TransactionManager() manager: EntityManager,) {
    return this.articleRepo(manager).find({relations: ["unitOfMeasurement", "articleStocks"]});
  }

  @Transaction()
  @Authorized("admin")
  @Post()
  public save(@TransactionManager() manager: EntityManager, @EntityFromBody() article: Article) {
    return this.articleRepo(manager).save(article);
  }

  @Transaction()
  @Authorized("admin")
  @Put("/:id([0-9]+)")
  public update(@TransactionManager() manager: EntityManager,
                @EntityFromParam("id") article: Article,
                @EntityFromBody() newArticle: Article) {
    return this.articleRepo(manager).save(this.articleRepo(manager).merge(article, newArticle));
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager, @EntityFromParam("id") article: Article) {
    return this.articleRepo(manager).remove(article);
  }
}
