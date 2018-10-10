import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {ArticleCheckIn} from "../models/ArticleCheckIn";

@JsonController("/api/articleCheckIn")
export class ArticleCheckInController {
  private articleCheckInRepository: Repository<ArticleCheckIn>;

  constructor() {
    this.articleCheckInRepository = getManager().getRepository(ArticleCheckIn);
  }

  @Authorized()
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@Param("id") id: number) {
    return this.articleCheckInRepository.findOne(id, {relations: ["articleStock", "user"]});
  }

  @Authorized()
  @Get("/withAll")
  public getAllWithAll() {
    return this.articleCheckInRepository.find({relations: ["articleStock", "user"]});
  }

  @Authorized()
  @Post("/withAll")
  public save(@EntityFromBody() article: ArticleCheckIn) {
    return this.articleCheckInRepository.save(article);
  }

  @Authorized()
  @Put("/withAll/:id([0-9]+)")
  public update(@EntityFromParam("id") articleCheckIn: ArticleCheckIn, @EntityFromBody() changeArticleCheckIn: ArticleCheckIn) {
    return this.articleCheckInRepository.save(this.articleCheckInRepository.merge(articleCheckIn, changeArticleCheckIn));
  }

  @Authorized()
  @Delete("/withAll/:id([0-9]+)")
  public delete(@EntityFromParam("id") article: ArticleCheckIn) {
    return this.articleCheckInRepository.remove(article);
  }
}
