import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {User} from "../models/User";
import {IModelWrapper} from "./IModelWrapper";

export class UserModelWrapper implements IModelWrapper<User> {

  public name() {
    return "User";
  }

  public create(values?: any, options?: ICreateOptions): Promise<User> {
    return User.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<User[]> {
    return User.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: User[]; count: number; }> {
    return User.findAndCountAll(options);
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<User> {
    return User.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, User[]]> {
    return User.update(values, options);
  }

}
