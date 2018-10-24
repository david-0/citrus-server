import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {ArticleStock} from "../entity/ArticleStock";

@JsonController("/api/articleStock")
export class ArticleStockController {
  private articleStockRepository: Repository<ArticleStock>;

  constructor() {
    this.articleStockRepository = getManager().getRepository(ArticleStock);
  }

  @Get("/:id([0-9]+)")
  public get(@Param("id") id: number) {
    return this.articleStockRepository.findOne(id);
  }

  @Get()
  public getAll() {
    return this.articleStockRepository.find();
  }

  @Authorized("admin")
  @Get("/withArticle/:id([0-9]+)")
  public getWithStock(@Param("id") id: number) {
    return this.articleStockRepository.findOne(id, {relations: ["article"]});
  }

  @Authorized("admin")
  @Get("/withArticle")
  public getAllWithStock() {
    return this.articleStockRepository.find({relations: ["article"]});
  }

  @Authorized("admin")
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@Param("id") id: number) {
    return this.articleStockRepository.findOne(id, {
      relations: ["article", "article.unitOfMeasurement",
        "checkIns", "checkOuts", "location"],
    });
  }

  @Authorized(["admin", "store"])
  @Get("/withAll")
  public getAllWithAll() {
    return this.articleStockRepository.find({
      relations: ["article", "article.unitOfMeasurement",
        "checkIns", "checkOuts", "location"],
    });
  }

  @Authorized("admin")
  @Post("/withAll")
  public saveWithAll(@EntityFromBody() articleStock: ArticleStock) {
    return this.articleStockRepository.save(articleStock);
  }

  @Authorized("admin")
  @Put("/withAll/:id([0-9]+)")
  public updateWithAll(@EntityFromParam("id") articleStock: ArticleStock, @EntityFromBody() changeArticleStock: ArticleStock) {
    return this.articleStockRepository.save(this.articleStockRepository.merge(articleStock, changeArticleStock));
  }

  @Authorized("admin")
  @Delete("/withAll/:id([0-9]+)")
  public deleteWithAll(@EntityFromParam("id") articleStock: ArticleStock) {
    return this.articleStockRepository.remove(articleStock);
  }

  @Authorized("admin")
  @Post()
  public save(@EntityFromBody() articleStock: ArticleStock) {
    return this.articleStockRepository.save(articleStock);
  }

  @Authorized("admin")
  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") articleStock: ArticleStock) {
    return this.articleStockRepository.remove(articleStock);
  }
}
