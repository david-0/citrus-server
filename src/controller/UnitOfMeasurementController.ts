import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {UnitOfMeasurement} from "../entity/UnitOfMeasurement";

@Authorized("admin")
@JsonController("/api/unitOfMeasurement")
export class UnitOfMeasurementController {
  private unitOfMeasurementRepository: Repository<UnitOfMeasurement>;

  constructor() {
    this.unitOfMeasurementRepository = getManager().getRepository(UnitOfMeasurement);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") unitOfMeasurement: UnitOfMeasurement) {
    return unitOfMeasurement;
  }

  @Get()
  public getAll() {
    return this.unitOfMeasurementRepository.find();
  }

  @Get("/withArticles/:id([0-9]+)")
  public getWithArticles(@Param("id") id: number) {
    return this.unitOfMeasurementRepository.findOne(id, {relations: ["articles"]});
  }

  @Get("/withArticles")
  public getAllWithArticles() {
    return this.unitOfMeasurementRepository.find({relations: ["articles"]});
  }

  @Delete("/withArticles/:id([0-9]+)")
  public deleteWithArticles(@EntityFromParam("id") unitOfMeasurement: UnitOfMeasurement) {
    return this.unitOfMeasurementRepository.remove(unitOfMeasurement);
  }

  @Post()
  public save(@EntityFromBody() unitOfMeasurement: UnitOfMeasurement) {
    return this.unitOfMeasurementRepository.save(unitOfMeasurement);
  }

  @Put("/:id([0-9]+)")
  public update(@EntityFromParam("id") unitOfMeasurement: UnitOfMeasurement, @EntityFromBody() newUnitOfMeasurement: UnitOfMeasurement) {
    return this.unitOfMeasurementRepository.save(this.unitOfMeasurementRepository.merge(unitOfMeasurement, newUnitOfMeasurement));
  }


  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") unitOfMeasurement: UnitOfMeasurement) {
    return this.unitOfMeasurementRepository.remove(unitOfMeasurement);
  }
}
