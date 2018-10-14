import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Article} from "../entity/Article";

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
    return this.articleRepository.find({
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

  @Authorized()
  @Get("/withStock/:id([0-9]+)")
  public getWithStock(@Param("id") id: number) {
    return this.articleRepository.findOne(id, {relations: ["unitOfMeasurement", "articleStocks"]});
  }

  @Authorized()
  @Get("/withStock")
  public getAllWithStock() {
    return this.articleRepository.find({relations: ["unitOfMeasurement", "articleStocks"]});
  }

  @Authorized()
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@Param("id") id: number) {
    return this.articleRepository.findOne(id, {relations: ["unitOfMeasurement", "articleStocks"]});
  }

  @Authorized()
  @Get("/withAll")
  public getAllWithAll() {
    return this.articleRepository.find({relations: ["unitOfMeasurement", "articleStocks"]});
  }

  @Authorized()
  @Post()
  public save(@EntityFromBody() article: Article) {
    return this.articleRepository.save(article);
  }

  @Authorized()
  @Put("/:id([0-9]+)")
  public update(@EntityFromParam("id") article: Article, @EntityFromBody() newArticle: Article) {
    return this.articleRepository.save(this.articleRepository.merge(article, newArticle));
  }

  @Authorized()
  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") article: Article) {
    return this.articleRepository.remove(article);
  }
}
