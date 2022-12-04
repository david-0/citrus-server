import { LocationDto } from "citrus-common";
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { LocationConverter } from "../converter/LocationConverter";
import { Location } from "../entity/Location";
import { OpeningHour } from "../entity/OpeningHour";

@JsonController("/api/location")
export class LocationController {
  private locationRepo: (manager: EntityManager) => Repository<Location>;

  constructor() {
    this.locationRepo = manager => manager.getRepository(Location);
  }

  @Transaction()
  @Authorized("admin")
  @Get("/:id([0-9]+)")
  public async get(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<LocationDto> {
    return LocationConverter.toDto(await this.locationRepo(manager).findOne(id));
  }

  @Transaction()
  @Authorized("admin")
  @Get()
  public async getAll(@TransactionManager() manager: EntityManager): Promise<LocationDto[]> {
    return LocationConverter.toDtos(await this.locationRepo(manager).find({
      order: {
        id: "ASC"
      },
    }
    ));
  }

  @Transaction()
  @Get("/withOpeningHours/:id([0-9]+)")
  public async getWithOpeningHours(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<LocationDto> {
    return LocationConverter.toDto(await this.locationRepo(manager).findOne(id, { relations: ["openingHours"] }));
  }

  @Transaction()
  @Get("/withOpeningHours")
  public async getAllWithOpeningHours(@TransactionManager() manager: EntityManager): Promise<LocationDto[]> {
    return LocationConverter.toDtos(await this.locationRepo(manager).createQueryBuilder("l")
      .leftJoinAndSelect("l.openingHours", "o")
      .orderBy({ "o.fromDate": "ASC" })
      .getMany());
  }

  @Transaction()
  @Get("/withOpeningHoursStocksAndArticle")
  public async getAllWithOpeningHoursStocksAndArticle(@TransactionManager() manager: EntityManager): Promise<LocationDto[]> {
    return LocationConverter.toDtos(await this.locationRepo(manager).createQueryBuilder("l")
      .leftJoinAndSelect("l.openingHours", "o")
      .leftJoinAndSelect("l.articleStocks", "s")
      .leftJoinAndSelect("s.article", "a")
      .orderBy({ "o.fromDate": "ASC" })
      .getMany());
  }

  @Transaction()
  @Authorized("admin")
  @Post("/withOpeningHours")
  public async saveWithOpeningHours(@TransactionManager() manager: EntityManager, @Body() newLocation: Location): Promise<LocationDto> {
    const location = LocationConverter.toEntity(newLocation);
    return LocationConverter.toDto(await this.locationRepo(manager).save(location));
  }

  @Transaction()
  @Authorized("admin")
  @Put("/withOpeningHours/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changedLocation: Location): Promise<LocationDto> {
    const a = LocationConverter.toEntity(changedLocation);
    delete a.articleStocks;
    a.id = +id;
    return LocationConverter.toDto(await this.locationRepo(manager).save(a));
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll/:id([0-9]+)")
  public async getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<LocationDto> {
    return LocationConverter.toDto(await this.locationRepo(manager).findOne(id, { relations: ["articleStocks", "openingHours"] }));
  }

  @Transaction()
  @Authorized("admin")
  @Get("/withAll")
  public async getAllWithAll(@TransactionManager() manager: EntityManager): Promise<LocationDto[]> {
    return LocationConverter.toDtos(await this.locationRepo(manager).find({
      relations: ["articleStocks", "openingHours"],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Authorized("admin")
  @Post()
  public async save(@TransactionManager() manager: EntityManager, @Body() location: Location): Promise<LocationDto> {
    const l = LocationConverter.toEntity(location);
    return LocationConverter.toDto(await this.locationRepo(manager).save(l));
  }

  @Transaction()
  @Authorized("admin")
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    const location = await this.locationRepo(manager).findOne(id, { relations: ["openingHours"] });
    for (const item of location.openingHours) {
      await manager.getRepository(OpeningHour).remove(item);
    }
    return LocationConverter.toDto(await this.locationRepo(manager).remove(location));
  }
}
