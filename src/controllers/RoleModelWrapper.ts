import * as Promise from "bluebird";
import {Role} from "../models/Role";
import {IModelWrapper} from "./IModelWrapper";

export class RoleModelWrapper implements IModelWrapper<Role> {

  public name() {
    return "Role";
  }

  public create(value: Role): Promise<Role> {
    return Role.create(value);
  }

  public findAll(): Promise<Role[]> {
    return Role.findAll();
  }

  public findAndCountAll(): Promise<{ rows: Role[]; count: number; }> {
    return Role.findAndCountAll();
  }

  public findById(identifier?: string | number): Promise<Role> {
    return Role.findById(identifier);
  }

  public update(value: Role): Promise<[number, Role[]]> {
    return Role.update(value, {where: {id: value.id}});
  }

}
