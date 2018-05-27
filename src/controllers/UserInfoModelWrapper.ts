import * as Promise from "bluebird";
import {User} from "../models/User";
import {IModelWrapper} from "./IModelWrapper";

export class UserInfoModelWrapper implements IModelWrapper<User> {

  public name() {
    return "User";
  }

  public create(value: User): Promise<User> {
    return User.create(value);
  }

  public findAll(): Promise<User[]> {
    return User.findAll({
      attributes: {exclude: ["password"]}
    });
  }

  public findAndCountAll(): Promise<{ rows: User[]; count: number; }> {
    return User.findAndCountAll({
      attributes: {exclude: ["password"]}
    });
  }

  public findById(identifier?: string | number): Promise<User> {
    return User.findById(identifier, {
      attributes: {exclude: ["password"]}
    });
  }

  public update(value: User): Promise<[number, User[]]> {
    return User.update(value, {
      where: {id: value.id},
      fields: ["number", "email", "name", "prename", "phone", "mobile"],
    });
  }
}
