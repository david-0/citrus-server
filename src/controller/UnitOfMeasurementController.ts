import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {UnitOfMeasurement} from "../entity/UnitOfMeasurement";

@Authorized("admin")
@JsonController("/api/unitOfMeasurement")
export class UnitOfMeasurementController {
  private unitOfMeasurementRepo: (manager: EntityManager) => Repository<UnitOfMeasurement>;

  constructor() {
    this.unitOfMeasurementRepo = manager => manager.getRepository(UnitOfMeasurement);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") unitOfMeasurement: UnitOfMeasurement) {
    return unitOfMeasurement;
  }

  @Transaction()
  @Get()
  public getAll(@TransactionManager() manager: EntityManager) {
    return this.unitOfMeasurementRepo(manager).find();
  }

  @Transaction()
  @Get("/withArticles/:id([0-9]+)")
  public getWithArticles(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.unitOfMeasurementRepo(manager).findOne(id, {relations: ["articles"]});
  }

  @Transaction()
  @Get("/withArticles")
  public getAllWithArticles(@TransactionManager() manager: EntityManager) {
    return this.unitOfMeasurementRepo(manager).find({relations: ["articles"]});
  }

  @Transaction()
  @Delete("/withArticles/:id([0-9]+)")
  public deleteWithArticles(@TransactionManager() manager: EntityManager,
                            @EntityFromParam("id") unitOfMeasurement: UnitOfMeasurement) {
    return this.unitOfMeasurementRepo(manager).remove(unitOfMeasurement);
  }

  @Transaction()
  @Post()
  public save(@TransactionManager() manager: EntityManager,
              @EntityFromBody() unitOfMeasurement: UnitOfMeasurement) {
    return this.unitOfMeasurementRepo(manager).save(unitOfMeasurement);
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public update(@TransactionManager() manager: EntityManager,
                @EntityFromParam("id") unitOfMeasurement: UnitOfMeasurement,
                @EntityFromBody() newUnitOfMeasurement: UnitOfMeasurement) {
    return this.unitOfMeasurementRepo(manager).save(this.unitOfMeasurementRepo(manager).merge(unitOfMeasurement, newUnitOfMeasurement));
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager, @EntityFromParam("id") unitOfMeasurement: UnitOfMeasurement) {
    return this.unitOfMeasurementRepo(manager).remove(unitOfMeasurement);
  }
}
