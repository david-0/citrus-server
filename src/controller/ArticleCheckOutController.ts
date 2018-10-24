import {Authorized, CurrentUser, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {ArticleCheckOut} from "../entity/ArticleCheckOut";

@JsonController("/api/articleCheckOut")
export class ArticleCheckOutController {
  private articleCheckOutRepository: Repository<ArticleCheckOut>;

  constructor() {
    this.articleCheckOutRepository = getManager().getRepository(ArticleCheckOut);
  }

  @Authorized("admin")
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@Param("id") id: number) {
    return this.articleCheckOutRepository.findOne(id, {
      relations: [
        "articleStock",
        "articleStock.article",
        "articleStock.article.unitOfMeasurement",
        "articleStock.location",
        "doneUser",
      ],
    });
  }

  @Authorized("admin")
  @Get("/withAll")
  public getAllWithAll() {
    return this.articleCheckOutRepository.find({
      relations: [
        "articleStock",
        "articleStock.article",
        "articleStock.article.unitOfMeasurement",
        "articleStock.location",
        "doneUser",
      ],
    });
  }

  @Authorized(["admin", "store"])
  @Post("/withAll")
  public save(@EntityFromBody() article: ArticleCheckOut, @CurrentUser({required: true}) userId: number) {
    return this.articleCheckOutRepository.save(article, {data: userId});
  }

  @Authorized("admin")
  @Put("/withAll/:id([0-9]+)")
  public update(@EntityFromParam("id") articleCheckOut: ArticleCheckOut,
                @EntityFromBody() changeArticleCheckOut: ArticleCheckOut,
                @CurrentUser({required: true}) userId: number) {
    return this.articleCheckOutRepository.save(
      this.articleCheckOutRepository.merge(articleCheckOut, changeArticleCheckOut), {data: userId}
    );
  }

  @Authorized("admin")
  @Delete("/withAll/:id([0-9]+)")
  public delete(@EntityFromParam("id") article: ArticleCheckOut, @CurrentUser({required: true}) userId: number) {
    return this.articleCheckOutRepository.remove(article, {data: userId});
  }
}
