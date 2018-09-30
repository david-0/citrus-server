import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";
import {Role} from "../models/Role";
import {IModelWrapper} from "./IModelWrapper";

export class RoleModelWrapper implements IModelWrapper<Role> {

  public name() {
    return "Role";
  }

  public create(value: Role, transaction: Transaction): Promise<Role> {
    return Role.create(value, {transaction});
  }

  public findAll(transaction: Transaction): Promise<Role[]> {
    return Role.findAll({transaction});
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: Role[]; count: number; }> {
    return Role.findAndCountAll({transaction});
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<Role> {
    return Role.findById(identifier, {transaction});
  }

  public update(value: Role, transaction: Transaction): Promise<[number, Role[]]> {
    return Role.update(value, {
      transaction,
      where: {id: value.id},
    });
  }

  public delete(value: Role, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }
}
