import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {User} from "../models/User";
import {IModelWrapper} from "./IModelWrapper";

export class UserInfoModelWrapper implements IModelWrapper<User> {

  public name() {
    return "User";
  }

  public create(value: User, transaction: Transaction): Promise<User> {
    return User.create(value, {transaction});
  }

  public findAll(transaction: Transaction): Promise<User[]> {
    return User.findAll({
      attributes: {exclude: ["password"]},
      transaction,
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: User[]; count: number; }> {
    return User.findAndCountAll({
      attributes: {exclude: ["password"]},
      transaction,
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<User> {
    return User.findById(identifier, {
      attributes: {exclude: ["password"]},
      transaction,
    });
  }

  public update(value: User, transaction: Transaction): Promise<[number, User[]]> {
    return User.update(value, {
      where: {id: value.id},
      fields: ["number", "email", "name", "prename", "phone", "mobile"],
      transaction,
    });
  }
}
