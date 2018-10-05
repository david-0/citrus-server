import {Authorized, Delete, Get, JsonController, Param, Post} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Location} from "../models/Location";

@JsonController("/api/location")
export class LocationController {
  private locationRepository: Repository<Location>;

  constructor() {
    this.locationRepository = getManager().getRepository(Location);
  }

  @Authorized()
  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") location: Location) {
    return location;
  }

  @Authorized()
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

  @Authorized()
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@Param("id") id: number) {
    return this.locationRepository.findOne(id, {relations: ["articleStocks", "openingHours"]});
  }

  @Authorized()
  @Get("/withAll")
  public getAllWithAll() {
    return this.locationRepository.find({relations: ["articleStocks", "openingHours"]});
  }

  @Authorized()
  @Post()
  public save(@EntityFromBody() location: Location) {
    return this.locationRepository.save(location);
  }

  @Authorized()
  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") location: Location) {
    return this.locationRepository.remove(location);
  }
}
