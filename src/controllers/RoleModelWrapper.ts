import * as Promise from "bluebird";
import {UpdateOptions} from "sequelize";
import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import {Role} from "../models/Role";
import {IModelWrapper} from "./IModelWrapper";

export class RoleModelWrapper implements IModelWrapper<Role> {

  public name() {
    return "Role";
  }

  public create(values?: any, options?: ICreateOptions): Promise<Role> {
    return Role.create(values, options);
  }

  public findAll(options?: IFindOptions<Role>): Promise<Role[]> {
    return Role.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions<Role>): Promise<{ rows: Role[]; count: number; }> {
    return Role.findAndCountAll();
  }

  public findById(identifier?: string | number, options?: IFindOptions<Role>): Promise<Role> {
    return Role.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, Role[]]> {
    return Role.update(values, options);
  }

}
