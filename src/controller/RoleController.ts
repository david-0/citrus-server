import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Role} from "../entity/Role";

@Authorized("admin")
@JsonController("/api/role")
export class RoleController {
  private roleRepo: (manager: EntityManager) => Repository<Role>;

  constructor() {
    this.roleRepo = manager => manager.getRepository(Role);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") role: Role) {
    return role;
  }

  @Transaction()
  @Get()
  public getAll(@TransactionManager() manager: EntityManager) {
    return this.roleRepo(manager).find();
  }

  @Transaction()
  @Get("/withUsers/:id([0-9]+)")
  public getWithUsers(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.roleRepo(manager).findOne(id, {relations: ["users"]});
  }

  @Transaction()
  @Get("/withUsers")
  public getAllWithUsers(@TransactionManager() manager: EntityManager) {
    return this.roleRepo(manager).find({relations: ["users"]});
  }

  @Transaction()
  @Delete("/withUsers/:id([0-9]+)")
  public deleteWithUsers(@TransactionManager() manager: EntityManager, @EntityFromParam("id") role: Role) {
    return this.roleRepo(manager).remove(role);
  }

  @Transaction()
  @Put("/:id([0-9]+)")
  public update(@TransactionManager() manager: EntityManager,
                @EntityFromParam("id") role: Role,
                @EntityFromBody() newRole: Role) {
    return this.roleRepo(manager).save(this.roleRepo(manager).merge(role, newRole));
  }

  @Transaction()
  @Post()
  public save(@TransactionManager() manager: EntityManager, @EntityFromBody() role: Role) {
    return this.roleRepo(manager).save(role);
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager, @EntityFromParam("id") role: Role) {
    return this.roleRepo(manager).remove(role);
  }
}
