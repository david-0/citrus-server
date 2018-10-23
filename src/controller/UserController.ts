import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {User} from "../entity/User";

@Authorized("admin")
@JsonController("/api/user")
export class UserController {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getManager().getRepository(User);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") user: User) {
    return user;
  }

  @Get()
  public getAll() {
    return this.userRepository.find();
  }

  @Get("/withRoles/:id([0-9]+)")
  public getWithRoles(@Param("id") id: number) {
    return this.userRepository.findOne(id, {relations: ["roles"]});
  }

  @Get("/withRoles")
  public getAllWithRoles() {
    return this.userRepository.find({relations: ["roles"]});
  }

  @Post("/withRoles")
  public saveWithRoles(@EntityFromBody() user: User) {
    return this.userRepository.save(user);
  }

  @Put("/withRoles/:id([0-9]+)")
  public updateWithRoles(@EntityFromParam("id") user: User, @EntityFromBody() newUser: User) {
    return this.userRepository.save(this.userRepository.merge(user, newUser));
  }

  @Get("/withAll/:id([0-9]+)")
  public getWithAll(@Param("id") id: number) {
    return this.userRepository.findOne(id, {relations: ["roles", "orders", "articleCheckIns", "articleCheckOuts", "addresses"]});
  }

  @Get("/withAll")
  public getAllWithAll() {
    return this.userRepository.find({relations: ["roles", "orders", "articleCheckIns", "articleCheckOuts", "addresses"]});
  }

  @Delete("/withAll/:id([0-9]+)")
  public deleteWithAll(@EntityFromParam("id") user: User) {
    return this.userRepository.remove(user);
  }

  @Post()
  public save(@EntityFromBody() user: User) {
    return this.userRepository.save(user);
  }

  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") user: User) {
    return this.userRepository.remove(user);
  }
}
