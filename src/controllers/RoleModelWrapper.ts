import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {Address} from "../models/Address";
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
      where: {id: value.id},
      transaction,
    });
  }

  public delete(value: Role, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }
}
