import { UnitOfMeasurementDto } from "citrus-common";
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { UnitOfMeasurementConverter } from "../converter/UnitOfMeasurementConverter";
import { UnitOfMeasurement } from "../entity/UnitOfMeasurement";

@Authorized("admin")
@JsonController("/api/unitOfMeasurement")
export class UnitOfMeasurementController {
  private unitOfMeasurementRepo: (manager: EntityManager) => Repository<UnitOfMeasurement>;

  constructor() {
    this.unitOfMeasurementRepo = manager => manager.getRepository(UnitOfMeasurement);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public async get(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<UnitOfMeasurementDto> {
    return UnitOfMeasurementConverter.toDto(await this.unitOfMeasurementRepo(manager).findOne(id));
  }

  @Transaction()
  @Get()
  public async getAll(@TransactionManager() manager: EntityManager): Promise<UnitOfMeasurementDto[]> {
    return UnitOfMeasurementConverter.toDtos(await this.unitOfMeasurementRepo(manager).find({
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Get("/withArticles/:id([0-9]+)")
  public async getWithArticles(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<UnitOfMeasurementDto> {
    return UnitOfMeasurementConverter.toDto(await this.unitOfMeasurementRepo(manager).findOne(id, { relations: ["articles"] }));
  }

  @Transaction()
  @Get("/withArticles")
  public async getAllWithArticles(@TransactionManager() manager: EntityManager): Promise<UnitOfMeasurementDto[]> {
    return UnitOfMeasurementConverter.toDtos(await this.unitOfMeasurementRepo(manager).find({ relations: ["articles"] }));
  }

  @Transaction()
  @Delete("/withArticles/:id([0-9]+)")
  public async deleteWithArticles(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<UnitOfMeasurementDto> {
    const unitOfMeasurement = new UnitOfMeasurement();
    unitOfMeasurement.id = +id;
    return UnitOfMeasurementConverter.toDto(await this.unitOfMeasurementRepo(manager).remove(unitOfMeasurement));
  }

  @Transaction()
  @Post()
  public async save(@TransactionManager() manager: EntityManager, @Body() newUnitOfMeasurement: UnitOfMeasurement): Promise<UnitOfMeasurementDto> {
    const unitOfMeasurement = UnitOfMeasurementConverter.toEntity(newUnitOfMeasurement);
    return UnitOfMeasurementConverter.toDto(await this.unitOfMeasurementRepo(manager).save(unitOfMeasurement));
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changedUnitOfMeasurement: UnitOfMeasurement): Promise<UnitOfMeasurementDto> {
    const a = UnitOfMeasurementConverter.toEntity(changedUnitOfMeasurement);
    a.id = +id;
    return UnitOfMeasurementConverter.toDto(await this.unitOfMeasurementRepo(manager).save(a));
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    const unitOfMeasurement = new UnitOfMeasurement();
    unitOfMeasurement.id = +id;
    return UnitOfMeasurementConverter.toDto(await this.unitOfMeasurementRepo(manager).remove(unitOfMeasurement));
  }
}
