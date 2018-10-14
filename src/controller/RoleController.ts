import {Authorized, Delete, Get, JsonController, Param, Post, Put} from "routing-controllers";
import {getManager, Repository} from "typeorm";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import {Role} from "../entity/Role";
import {User} from "../entity/User";

@Authorized()
@JsonController("/api/role")
export class RoleController {
  private roleRepository: Repository<Role>;

  constructor() {
    this.roleRepository = getManager().getRepository(Role);
  }

  @Get("/:id([0-9]+)")
  public get(@EntityFromParam("id") role: Role) {
    return role;
  }

  @Get()
  public getAll() {
    return this.roleRepository.find();
  }

  @Get("/withUsers/:id([0-9]+)")
  public getWithUsers(@Param("id") id: number) {
    return this.roleRepository.findOne(id, {relations: ["users"]});
  }

  @Get("/withUsers")
  public getAllWithUsers() {
    return this.roleRepository.find({relations: ["users"]});
  }

  @Delete("/withUsers/:id([0-9]+)")
  public deleteWithUsers(@EntityFromParam("id") role: Role) {
    return this.roleRepository.remove(role);
  }

  @Put("/:id([0-9]+)")
  public update(@EntityFromParam("id") role: Role, @EntityFromBody() newRole: Role) {
    return this.roleRepository.save(this.roleRepository.merge(role, newRole));
  }

  @Post()
  public save(@EntityFromBody() role: Role) {
    return this.roleRepository.save(role);
  }

  @Delete("/:id([0-9]+)")
  public delete(@EntityFromParam("id") role: Role) {
    return this.roleRepository.remove(role);
  }
}
