import {Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Address} from "../models/Address";
import {Role} from "../models/Role";

@JsonController("/api/address")
export class AddressController {
  private addressRepository: Repository<Address>;

  constructor() {
    this.addressRepository = getManager().getRepository(Address);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") address: Address) {
    return address;
  }

  @Get()
  public getAll() {
    return this.addressRepository.find();
  }

  @Get("/withUser/:id([0-9]+)")
  public getWithUser(@Param("id") id: number) {
    return this.addressRepository.findOne(id, {relations: ["user"]});
  }

  @Get("/withUser")
  public getAllWithUser() {
    return this.addressRepository.find({relations: ["user"]});
  }

  @Post("/withUser")
  public saveWithUser(@EntityFromBody() address: Address) {
    return this.addressRepository.save(address);
  }

  @Put("/withUser/:id([0-9]+)")
  public updateWithUser(@EntityFromParam("id") address: Address, @EntityFromBody() newAddress: Address) {
    return this.addressRepository.save(this.addressRepository.merge(address, newAddress));
  }

  @Delete("/withUser/:id([0-9]+)")
  public deleteWithUser(@EntityFromParam("id") address: Address) {
    return this.addressRepository.remove(address);
  }
}
