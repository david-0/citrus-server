import {Authorized, Delete, Get, JsonController, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {OpeningHour} from "../entity/OpeningHour";

@Authorized("admin")
@JsonController("/api/openingHour")
export class OpeningHourController {
  private openingHourRepo: (manager: EntityManager) => Repository<OpeningHour>;

  constructor() {
    this.openingHourRepo = manager => manager.getRepository(OpeningHour);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") openingHour: OpeningHour) {
    return openingHour;
  }

  @Transaction()
  @Get()
  public getAll(@TransactionManager() manager: EntityManager) {
    return this.openingHourRepo(manager).find();
  }

  @Transaction()
  @Post()
  public save(@TransactionManager() manager: EntityManager, @EntityFromBody() openingHour: OpeningHour) {
    return this.openingHourRepo(manager).save(openingHour);
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public update(@TransactionManager() manager: EntityManager,
                @EntityFromParam("id") openingHour: OpeningHour,
                @EntityFromBody() changedOpeningHour: OpeningHour) {
    return this.openingHourRepo(manager).save(this.openingHourRepo(manager).merge(openingHour, changedOpeningHour));
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager, @EntityFromParam("id") openingHour: OpeningHour) {
    return this.openingHourRepo(manager).remove(openingHour);
  }
}
