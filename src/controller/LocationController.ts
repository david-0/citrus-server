import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Article} from "../entity/Article";
import {Location} from "../entity/Location";

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
  @Post("/withOpeningHours")
  public saveWithOpeningHours(@EntityFromBody() location: Location) {
    return this.locationRepository.save(location);
  }

  @Authorized()
  @Put("/withOpeningHours/:id([0-9]+)")
  public update(@EntityFromParam("id") location: Location, @EntityFromBody() changedLocation: Location) {
    return this.locationRepository.save(this.locationRepository.merge(location, changedLocation));
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
