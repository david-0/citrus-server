import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {EntityManager, Repository, Transaction, TransactionManager} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {User} from "../entity/User";

@Authorized("admin")
@JsonController("/api/user")
export class UserController {
  private userRepo: (manager: EntityManager) => Repository<User>;

  constructor() {
    this.userRepo = manager => manager.getRepository(User);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") user: User) {
    return user;
  }

  @Transaction()
  @Get()
  public getAll(@TransactionManager() manager: EntityManager) {
    return this.userRepo(manager).find();
  }

  @Transaction()
  @Get("/withRoles/:id([0-9]+)")
  public getWithRoles(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.userRepo(manager).findOne(id, {relations: ["roles"]});
  }

  @Transaction()
  @Get("/withRoles")
  public getAllWithRoles(@TransactionManager() manager: EntityManager) {
    return this.userRepo(manager).find({relations: ["roles"]});
  }

  @Transaction()
  @Post("/withRoles")
  public saveWithRoles(@TransactionManager() manager: EntityManager, @EntityFromBody() user: User) {
    return this.userRepo(manager).save(user);
  }

  @Transaction()
  @Put("/withRoles/:id([0-9]+)")
  public updateWithRoles(@TransactionManager() manager: EntityManager, @EntityFromParam("id") user: User, @EntityFromBody() newUser: User) {
    return this.userRepo(manager).save(this.userRepo(manager).merge(user, newUser));
  }

  @Transaction()
  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    return this.userRepo(manager).findOne(id, {relations: ["roles", "orders", "articleCheckIns", "articleCheckOuts", "addresses"]});
  }

  @Transaction()
  @Get("/withAll")
  public getAllWithAll(@TransactionManager() manager: EntityManager) {
    return this.userRepo(manager).find({relations: ["roles", "orders", "articleCheckIns", "articleCheckOuts", "addresses"]});
  }

  @Transaction()
  @Delete("/withAll/:id([0-9]+)")
  public deleteWithAll(@TransactionManager() manager: EntityManager, @EntityFromParam("id") user: User) {
    return this.userRepo(manager).remove(user);
  }

  @Transaction()
  @Post()
  public save(@TransactionManager() manager: EntityManager, @EntityFromBody() user: User) {
    return this.userRepo(manager).save(user);
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public delete(@TransactionManager() manager: EntityManager, @EntityFromParam("id") user: User) {
    return this.userRepo(manager).remove(user);
  }
}
