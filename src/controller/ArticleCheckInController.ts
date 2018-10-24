import {Authorized, CurrentUser, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {ArticleCheckIn} from "../entity/ArticleCheckIn";

@JsonController("/api/articleCheckIn")
export class ArticleCheckInController {
  private articleCheckInRepository: Repository<ArticleCheckIn>;

  constructor() {
    this.articleCheckInRepository = getManager().getRepository(ArticleCheckIn);
  }

  @Authorized("admin")
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@Param("id") id: number) {
    return this.articleCheckInRepository.findOne(id, {
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
    return this.articleCheckInRepository.find({
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
  public async save(@EntityFromBody() article: ArticleCheckIn, @CurrentUser({required: true}) userId: number) {
    return this.articleCheckInRepository.save(article, {data: userId});
  }

  @Authorized("admin")
  @Put("/withAll/:id([0-9]+)")
  public update(@EntityFromParam("id") articleCheckIn: ArticleCheckIn,
                @EntityFromBody() changeArticleCheckIn: ArticleCheckIn,
                @CurrentUser({required: true}) userId: number) {
    return this.articleCheckInRepository.save(
      this.articleCheckInRepository.merge(articleCheckIn, changeArticleCheckIn), {data: userId},
    );
  }

  @Authorized("admin")
  @Delete("/withAll/:id([0-9]+)")
  public delete(@EntityFromParam("id") article: ArticleCheckIn, @CurrentUser({required: true}) userId: number) {
    return this.articleCheckInRepository.remove(article, {data: userId});
  }
}
