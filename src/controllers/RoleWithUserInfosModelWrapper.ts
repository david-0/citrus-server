import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {Role} from "../models/Role";
import {User} from "../models/User";
import {IModelWrapper} from "./IModelWrapper";

export class RoleWithUserInfosModelWrapper implements IModelWrapper<Role> {

  public name() {
    return "RoleWithUserInfos";
  }

  public create(value: Role, transaction: Transaction): Promise<Role> {
    return Role.create(value, {transaction});
  }

  public findAll(transaction: Transaction): Promise<Role[]> {
    return Role.findAll({
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }],
      transaction,
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: Role[]; count: number; }> {
    return Role.findAndCountAll({
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }],
      transaction,
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<Role> {
    return Role.findById(identifier, {
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }],
      transaction,
    });
  }

  public update(value: Role, transaction: Transaction): Promise<[number, Role[]]> {
    return Role.update(value, {
      where: {id: value.id},
      transaction,
    });
  }

  public delete(value: Role, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }
}
