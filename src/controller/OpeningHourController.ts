import {Authorized, Delete, Get, JsonController, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Location} from "../models/Location";
import {OpeningHour} from "../models/OpeningHour";

@Authorized()
@JsonController("/api/openingHour")
export class OpeningHourController {
  private openingHourRepository: Repository<OpeningHour>;

  constructor() {
    this.openingHourRepository = getManager().getRepository(OpeningHour);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") openingHour: OpeningHour) {
    return openingHour;
  }

  @Get()
  public getAll() {
    return this.openingHourRepository.find();
  }

  @Post()
  public save(@EntityFromBody() openingHour: OpeningHour) {
    return this.openingHourRepository.save(openingHour);
  }

  @Put("/:id([0-9]+)")
  public update(@EntityFromParam("id") openingHour: OpeningHour, @EntityFromBody() changedOpeningHour: OpeningHour) {
    return this.openingHourRepository.save(this.openingHourRepository.merge(openingHour, changedOpeningHour));
  }

  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") openingHour: OpeningHour) {
    return this.openingHourRepository.remove(openingHour);
  }
}
