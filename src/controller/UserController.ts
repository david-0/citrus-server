import { UserDto } from "citrus-common";
import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { EntityManager, Repository, Transaction, TransactionManager } from "typeorm";
import { UserConverter } from "../converter/UserConverter";
import { User } from "../entity/User";

@Authorized("admin")
@JsonController("/api/user")
export class UserController {
  private userRepo: (manager: EntityManager) => Repository<User>;

  constructor() {
    this.userRepo = manager => manager.getRepository(User);
  }

  @Transaction()
  @Get("/:id([0-9]+)")
  public async get(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<UserDto> {
    return UserConverter.toDto(await this.userRepo(manager).findOne(id));
  }

  @Transaction()
  @Get()
  public async getAll(@TransactionManager() manager: EntityManager): Promise<UserDto[]> {
    return UserConverter.toDtos(await this.userRepo(manager).find({
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Get("/withRoles/:id([0-9]+)")
  public async getWithRoles(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<UserDto> {
    return UserConverter.toDto(await this.userRepo(manager).findOne(id, { relations: ["roles"] }));
  }

  @Transaction()
  @Get("/withRoles")
  public async getAllWithRoles(@TransactionManager() manager: EntityManager): Promise<UserDto[]> {
    return UserConverter.toDtos(await this.userRepo(manager).find({
      relations: ["roles"],
      order: {
        id: "ASC"
      },
    }));
  }

  @Transaction()
  @Post("/withRoles")
  public async saveWithRoles(@TransactionManager() manager: EntityManager, @Body() newUser: User): Promise<UserDto> {
    const user = UserConverter.toEntity(newUser);
    delete user.articleCheckIns;
    delete user.articleCheckOuts;
    delete user.audits;
    delete user.orders;
    delete user.addresses;
    return UserConverter.toDto(await this.userRepo(manager).save(user));
  }

  @Transaction()
  @Put("/withRoles/:id([0-9]+)")
  public async updateWithRoles(@TransactionManager() manager: EntityManager, @Param("id") id: number, @Body() changedUser: User) {
    const a = UserConverter.toEntity(changedUser);
    a.id = +id;
    delete a.articleCheckIns;
    delete a.articleCheckOuts;
    delete a.audits;
    delete a.orders;
    delete a.addresses;
    return UserConverter.toDto(await this.userRepo(manager).save(a));
  }

  @Transaction()
  @Get("/withAll/:id([0-9]+)")
  public async getWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<UserDto> {
    return UserConverter.toDto(await this.userRepo(manager).findOne(id, {
      relations: [
        "roles",
        "orders",
        "articleCheckIns",
        "articleCheckOuts",
        "addresses"]
    }));
  }

  @Transaction()
  @Get("/withAll")
  public async getAllWithAll(@TransactionManager() manager: EntityManager): Promise<UserDto[]> {
    return UserConverter.toDtos(await this.userRepo(manager).find({
      relations: [
        "roles",
        "orders",
        "articleCheckIns",
        "articleCheckOuts",
        "addresses"]
    }));
  }

  @Transaction()
  @Delete("/withAll/:id([0-9]+)")
  public async deleteWithAll(@TransactionManager() manager: EntityManager, @Param("id") id: number): Promise<UserDto> {
    const user = new User();
    user.id = +id;
    return UserConverter.toDto(await this.userRepo(manager).remove(user));
  }

  @Transaction()
  @Post()
  public async save(@TransactionManager() manager: EntityManager, @Body() newUser: User) {
    const a = UserConverter.toEntity(newUser);
    delete a.articleCheckIns;
    delete a.articleCheckOuts;
    delete a.audits;
    delete a.orders;
    delete a.addresses;
    return UserConverter.toDto(await this.userRepo(manager).save(a));
  }

  @Transaction()
  @Delete("/:id([0-9]+)")
  public async delete(@TransactionManager() manager: EntityManager, @Param("id") id: number) {
    const a = new User();
    a.id = +id;
    delete a.articleCheckIns;
    delete a.articleCheckOuts;
    delete a.audits;
    delete a.orders;
    delete a.addresses;
    return UserConverter.toDto(await this.userRepo(manager).remove(a));
  }
}
