import {Delete, Get, JsonController, Param, Post} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Address} from "../models/Address";
import {Article} from "../models/Article";

@JsonController("/api/article")
export class ArticleController {
  private articleRepository: Repository<Article>;

  constructor() {
    this.articleRepository = getManager().getRepository(Article);
  }

  @Get("/:id([0-9]+)")
  public get(@Param("id") id: number) {
    return this.articleRepository.findOne(id, {relations: ["unitOfMeasurement"]});
  }

  @Get()
  public getAll() {
    return this.articleRepository.find({relations: ["unitOfMeasurement"]});
  }

  @Get("/inSale")
  public getAllInSale() {
    return this.articleRepository.find({where: {inSale: true}, relations: ["unitOfMeasurement", "articleStocks"]});
  }

  @Get("/withStock/:id([0-9]+)")
  public getWithStock(@Param("id") id: number) {
    return this.articleRepository.findOne(id, {relations: ["unitOfMeasurement", "articleStocks"]});
  }

  @Get("/withStock")
  public getAllWithStock() {
    return this.articleRepository.find({relations: ["unitOfMeasurement", "articleStocks"]});
  }

  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@Param("id") id: number) {
    return this.articleRepository.findOne(id, {relations: ["unitOfMeasurement", "articleStocks"]});
  }

  @Get("/withAll")
  public getAllWithAll() {
    return this.articleRepository.find({relations: ["unitOfMeasurement", "articleStocks"]});
  }

  @Post()
  public save(@EntityFromBody() article: Article) {
    return this.articleRepository.save(article);
  }

  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") article: Article) {
    return this.articleRepository.remove(article);
  }
}
