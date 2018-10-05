import {Delete, Get, JsonController, Param, Post} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Location} from "../models/Location";

@JsonController("/api/location")
export class LocationController {
  private locationRepository: Repository<Location>;

  constructor() {
    this.locationRepository = getManager().getRepository(Location);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") location: Location) {
    return location;
  }

  @Get()
  public getAll() {
    return this.locationRepository.find();
  }

  @Get("/withOpeningHours/:id([0-9]+)")
  public getWithOpeningHours(@Param("id") id: number) {
    return this.locationRepository.findOne(id, {relations: ["openingHours"]});
  }

  @Get("/withOpeningHours")
  public getAllWithOpeningHours() {
    return this.locationRepository.find({relations: ["openingHours"]});
  }

  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@Param("id") id: number) {
    return this.locationRepository.findOne(id, {relations: ["articleStocks", "openingHours"]});
  }

  @Get("/withAll")
  public getAllWithAll() {
    return this.locationRepository.find({relations: ["articleStocks", "openingHours"]});
  }

  @Post()
  public save(@EntityFromBody() location: Location) {
    return this.locationRepository.save(location);
  }

  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") location: Location) {
    return this.locationRepository.remove(location);
  }
}
