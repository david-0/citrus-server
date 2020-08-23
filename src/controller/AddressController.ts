import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Address} from "../entity/Address";

@Authorized("admin")
@JsonController("/api/address")
export class AddressController {
  private addressRepo: (manager: EntityManager) => Repository<Address>;

  constructor() {
    this.addressRepo = manager => manager.getRepository(Address);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") address: Address) {
    return address;
  }

  @Transaction()
  @Get()
  public getAll(@TransactionManager() manager: EntityManager) {
    return this.addressRepo(manager).find({
      order: {
        id: "ASC"
      },
    });
  }

  @Transaction()
  @Get("/withUser/:id([0-9]+)")
  public getWithUser(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.addressRepo(manager).findOne(id, {relations: ["user"]});
  }

  @Transaction()
  @Get("/withUser")
  public getAllWithUser(@TransactionManager() manager: EntityManager) {
    return this.addressRepo(manager).find({
      relations: ["user"],
      order: {
        id: "ASC"
      },
    });
  }

  @Transaction()
  @Post("/withUser")
  public saveWithUser(@TransactionManager() manager: EntityManager, @EntityFromBody() address: Address) {
    return this.addressRepo(manager).save(address);
  }

  @Transaction()
  @Put("/withUser/:id([0-9]+)")
  public updateWithUser(@TransactionManager() manager: EntityManager,
                        @EntityFromParam("id") address: Address,
                        @EntityFromBody() newAddress: Address) {
    const repo = this.addressRepo(manager);
    return repo.save(repo.merge(address, newAddress));
  }

  @Transaction()
  @Delete("/withUser/:id([0-9]+)")
  public deleteWithUser(@TransactionManager() manager: EntityManager, @EntityFromParam("id") address: Address) {
    return this.addressRepo(manager).remove(address);
  }
}
