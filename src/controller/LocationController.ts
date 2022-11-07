import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Location} from "../entity/Location";

@JsonController("/api/location")
export class LocationController {
  private locationRepo: (manager: EntityManager) => Repository<Location>;

  constructor() {
    this.locationRepo = manager => manager.getRepository(Location);
  }

  @Transaction()
  @Authorized("admin")
  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") location: Location) {
    return location;
  }

  @Transaction()
  @Authorized("admin")
  @Get()
  public getAll(@TransactionManager() manager: EntityManager) {
    return this.locationRepo(manager).find({
        order: {
          id: "ASC"
        },
      }
    );
  }

  @Transaction()
  @Get("/withOpeningHours/:id([0-9]+)")
  public getWithOpeningHours(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.locationRepo(manager).findOne(id, {relations: ["openingHours"]});
  }

  @Transaction()
  @Get("/withOpeningHours")
  public getAllWithOpeningHours(@TransactionManager() manager: EntityManager) {
    return this.locationRepo(manager).createQueryBuilder("l")
      .leftJoinAndSelect("l.openingHours", "o")
      .orderBy({"o.fromDate": "ASC"})
      .getMany();
  }

  @Transaction()
  @Get("/withOpeningHoursStocksAndArticle")
  public getAllWithOpeningHoursStocksAndArticle(@TransactionManager() manager: EntityManager) {
    const result = this.locationRepo(manager).createQueryBuilder("l")
      .leftJoinAndSelect("l.openingHours", "o")
      .leftJoinAndSelect("l.articleStocks", "s")
      .leftJoinAndSelect("s.article", "a")
      .orderBy({"o.fromDate": "ASC"})
      .getMany();
    return result;
  }

  @Transaction()
  @Authorized("admin")
  @Post("/withOpeningHours")
  public saveWithOpeningHours(@TransactionManager() manager: EntityManager, @EntityFromBody() location: Location) {
    return this.locationRepo(manager).save(location);
  }

  @Transaction()
  @Authorized("admin")
  @Put("/withOpeningHours/:id([0-9]+)")
  public update(@TransactionManager() manager: EntityManager,
                @EntityFromParam("id") location: Location,
                @EntityFromBody() changedLocation: Location) {
    return this.locationRepo(manager).save(this.locationRepo(manager).merge(location, changedLocation));
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.locationRepo(manager).findOne(id, {relations: ["articleStocks", "openingHours"]});
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll")
  public getAllWithAll(@TransactionManager() manager: EntityManager) {
    return this.locationRepo(manager).find({
      relations: ["articleStocks", "openingHours"],
      order: {
        id: "ASC"
      },
    });
  }

  @Transaction()
  @Authorized("admin")
  @Post()
  public save(@TransactionManager() manager: EntityManager, @EntityFromBody() location: Location) {
    return this.locationRepo(manager).save(location);
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager, @EntityFromParam("id") location: Location) {
    return this.locationRepo(manager).remove(location);
  }
}
