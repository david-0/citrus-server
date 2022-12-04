import { OpeningHourDto } from "citrus-common";
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { OpeningHourConverter } from "../converter/OpeningHourConverter";
import { OpeningHour } from "../entity/OpeningHour";

@Authorized("admin")
@JsonController("/api/openingHour")
export class OpeningHourController {
  private openingHourRepo: (manager: EntityManager) => Repository<OpeningHour>;

  constructor() {
    this.openingHourRepo = manager => manager.getRepository(OpeningHour);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public async get(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<OpeningHourDto> {
    return OpeningHourConverter.toDto(await this.openingHourRepo(manager).findOne(id));
  }

  @Transaction()
  @Get()
  public async getAll(@TransactionManager() manager: EntityManager): Promise<OpeningHourDto[]> {
    return OpeningHourConverter.toDtos(await this.openingHourRepo(manager).find({
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Post()
  public async save(@TransactionManager() manager: EntityManager, @Body() newOpeningHour: OpeningHour): Promise<OpeningHourDto> {
    const openingHour = OpeningHourConverter.toEntity(newOpeningHour);
    return OpeningHourConverter.toDto(await this.openingHourRepo(manager).save(openingHour));
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changedOpeningHour: OpeningHour): Promise<OpeningHourDto> {
    const o = OpeningHourConverter.toEntity(changedOpeningHour);
    o.id = +id;
    return OpeningHourConverter.toDto(await this.openingHourRepo(manager).save(o));
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<OpeningHourDto> {
    const openingHour = new OpeningHour();
    openingHour.id = +id;
    return OpeningHourConverter.toDto(await this.openingHourRepo(manager).remove(openingHour));
  }
}
