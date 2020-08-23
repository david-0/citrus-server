import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {Container} from "typedi";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Role} from "../entity/Role";
import {UrlService} from "../utils/UrlService";

@Authorized("admin")
@JsonController("/api/role")
export class RoleController {
  private roleRepo: (manager: EntityManager) => Repository<Role>;

  constructor() {
    this.roleRepo = manager => manager.getRepository(Role);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public async get(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return await this.roleRepo(manager).findOne(id);
  }

  @Transaction()
  @Get()
  public async getAll(@TransactionManager() manager: EntityManager) {
    return await this.roleRepo(manager).find({
      order: {
        id: "ASC"
      },
    });
  }

  @Transaction()
  @Get("/withUsers/:id([0-9]+)")
  public async getWithUsers(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return await this.roleRepo(manager).findOne(id, {relations: ["users"]});
  }

  @Transaction()
  @Get("/withUsers")
  public async getAllWithUsers(@TransactionManager() manager: EntityManager) {
    return await this.roleRepo(manager).find({relations: ["users"]});
  }

  @Transaction()
  @Delete("/withUsers/:id([0-9]+)")
  public async deleteWithUsers(@TransactionManager() manager: EntityManager, @EntityFromParam("id") role: Role) {
    return await this.roleRepo(manager).remove(role);
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public async update(@TransactionManager() manager: EntityManager,
                      @EntityFromParam("id") role: Role,
                      @EntityFromBody() newRole: Role) {
    return await this.roleRepo(manager).save(this.roleRepo(manager).merge(role, newRole));
  }
  @Transaction()
  @Post()
  public async save(@TransactionManager() manager: EntityManager, @EntityFromBody() role: Role) {
    return await this.roleRepo(manager).save(role);
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @EntityFromParam("id") role: Role) {
    return await this.roleRepo(manager).remove(role);
  }
}
