import { AddressDto } from "citrus-common";
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { AddressConverter } from "../converter/AddressConverter";
import { Address } from "../entity/Address";

@Authorized("admin")
@JsonController("/api/address")
export class AddressController {
  private addressRepo: (manager: EntityManager) => Repository<Address>;

  constructor() {
    this.addressRepo = manager => manager.getRepository(Address);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public async get(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<AddressDto> {
    return AddressConverter.toDto(await this.addressRepo(manager).findOne(id));
  }

  @Transaction()
  @Get()
  public async getAll(@TransactionManager() manager: EntityManager): Promise<AddressDto[]> {
    return await this.addressRepo(manager).find({
      order: {
        id: "ASC"
      },
    });
  }

  @Transaction()
  @Get("/withUser/:id([0-9]+)")
  public async getWithUser(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<AddressDto> {
    return AddressConverter.toDto(await this.addressRepo(manager).findOne(id, {
      relations: ["user"],
    }));
  }

  @Transaction()
  @Get("/withUser")
  public async getAllWithUser(@TransactionManager() manager: EntityManager): Promise<AddressDto[]> {
    return AddressConverter.toDtos(
      await this.addressRepo(manager).find({
        relations: ["user"],
        order: {
          id: "ASC"
        },
      }));
  }

  @Transaction()
  @Post("/withUser")
  public async saveWithUser(@TransactionManager() manager: EntityManager, @Body() newAddressBody: Address): Promise<AddressDto> {
    const address = AddressConverter.toEntity(newAddressBody);
    return AddressConverter.toDto(await this.addressRepo(manager).save(address));
  }

  @Transaction()
  @Put("/withUser/:id([0-9]+)")
  public async updateWithUser(@TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changedAddress: Address): Promise<AddressDto> {
    const a = AddressConverter.toEntity(changedAddress);
    a.id = +id;
    return AddressConverter.toDto(await this.addressRepo(manager).save(a));
  }

  @Transaction()
  @Delete("/withUser/:id([0-9]+)")
  public async deleteWithUser(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<AddressDto> {
    const address = new Address();
    address.id = +id;
    return AddressConverter.toDto(await this.addressRepo(manager).remove(address));
  }
}
