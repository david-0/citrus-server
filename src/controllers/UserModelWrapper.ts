import * as Promise from "bluebird";
import {UpdateOptions} from "sequelize";
import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import {User} from "../models/User";
import {IModelWrapper} from "./IModelWrapper";

export class UserModelWrapper implements IModelWrapper<User> {

  public name() {
    return "User";
  }

  public create(values?: any, options?: ICreateOptions): Promise<User> {
    return User.create(values, options);
  }

  public findAll(options?: IFindOptions<User>): Promise<User[]> {
    return User.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions<User>): Promise<{ rows: User[]; count: number; }> {
    return User.findAndCountAll();
  }

  public findById(identifier?: string | number, options?: IFindOptions<User>): Promise<User> {
    return User.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, User[]]> {
    return User.update(values, options);
  }

}
