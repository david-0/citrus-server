import { RoleDto } from "citrus-common";
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { RoleConverter } from "../converter/RoleConverter";
import { Role } from "../entity/Role";

@Authorized("admin")
@JsonController("/api/role")
export class RoleController {
  private roleRepo: (manager: EntityManager) => Repository<Role>;

  constructor() {
    this.roleRepo = manager => manager.getRepository(Role);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public async get(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<RoleDto> {
    return RoleConverter.toDto(await this.roleRepo(manager).findOne(id));
  }

  @Transaction()
  @Get()
  public async getAll(@TransactionManager() manager: EntityManager): Promise<RoleDto[]> {
    return RoleConverter.toDtos(await this.roleRepo(manager).find({
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Get("/withUsers/:id([0-9]+)")
  public async getWithUsers(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<RoleDto> {
    return RoleConverter.toDto(await this.roleRepo(manager).findOne(id, { relations: ["users"] }));
  }

  @Transaction()
  @Get("/withUsers")
  public async getAllWithUsers(@TransactionManager() manager: EntityManager): Promise<RoleDto[]> {
    return RoleConverter.toDtos(await this.roleRepo(manager).find({
      relations: ["users"],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Delete("/withUsers/:id([0-9]+)")
  public async deleteWithUsers(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<RoleDto> {
    const role = new Role();
    role.id = +id;
    return RoleConverter.toDto(await this.roleRepo(manager).remove(role));
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changedRole: Role): Promise<RoleDto> {
    const a = RoleConverter.toEntity(changedRole);
    a.id = +id;
    delete a.users;
    return RoleConverter.toDto(await this.roleRepo(manager).save(a));
  }

  @Transaction()
  @Post()
  public async save(@TransactionManager() manager: EntityManager, @Body() newRole: Role): Promise<RoleDto> {
    const role = RoleConverter.toEntity(newRole);
    delete role.users;
    return RoleConverter.toDto(await this.roleRepo(manager).save(role));
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    const role = new Role();
    role.id = +id;
    return RoleConverter.toDto(await this.roleRepo(manager).remove(role));
  }
}
