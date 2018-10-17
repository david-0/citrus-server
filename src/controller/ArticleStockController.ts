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

  @Authorized()
  @Get("/withArticle/:id([0-9]+)")
  public getWithStock(@Param("id") id: number) {
    return this.articleStockRepository.findOne(id, {relations: ["article"]});
  }

  @Authorized()
  @Get("/withArticle")
  public getAllWithStock() {
    return this.articleStockRepository.find({relations: ["article"]});
  }

  @Authorized()
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@Param("id") id: number) {
    return this.articleStockRepository.findOne(id, {
      relations: ["article", "article.unitOfMeasurement",
        "checkIns", "checkOuts", "orderItems", "location"]
    });
  }

  @Authorized()
  @Get("/withAll")
  public getAllWithAll() {
    return this.articleStockRepository.find({
      relations: ["article", "article.unitOfMeasurement",
        "checkIns", "checkOuts", "orderItems", "location"]
    });
  }

  @Authorized()
  @Post("/withAll")
  public saveWithAll(@EntityFromBody() articleStock: ArticleStock) {
    return this.articleStockRepository.save(articleStock);
  }

  @Authorized()
  @Put("/withAll/:id([0-9]+)")
  public updateWithAll(@EntityFromParam("id") articleStock: ArticleStock, @EntityFromBody() changeArticleStock: ArticleStock) {
    return this.articleStockRepository.save(this.articleStockRepository.merge(articleStock, changeArticleStock));
  }

  @Authorized()
  @Delete("/withAll/:id([0-9]+)")
  public deleteWithAll(@EntityFromParam("id") articleStock: ArticleStock) {
    return this.articleStockRepository.remove(articleStock);
  }

  @Authorized()
  @Post()
  public save(@EntityFromBody() articleStock: ArticleStock) {
    return this.articleStockRepository.save(articleStock);
  }

  @Authorized()
  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") articleStock: ArticleStock) {
    return this.articleStockRepository.remove(articleStock);
  }
}
