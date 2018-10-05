import {Authorized, Delete, Get, JsonController, Post} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {OpeningHour} from "../models/OpeningHour";

@Authorized()
@JsonController("/api/openingHour")
export class OpeningHourController {
  private roleRepository: Repository<OpeningHour>;

  constructor() {
    this.roleRepository = getManager().getRepository(OpeningHour);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") openingHour: OpeningHour) {
    return openingHour;
  }

  @Get()
  public getAll() {
    return this.roleRepository.find();
  }

  @Post()
  public save(@EntityFromBody() openingHour: OpeningHour) {
    return this.roleRepository.save(openingHour);
  }

  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") openingHour: OpeningHour) {
    return this.roleRepository.remove(openingHour);
  }
}
