import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {Address} from "../models/Address";
import {CustomerOrder} from "../models/CustomerOrder";
import {Role} from "../models/Role";
import {User} from "../models/User";
import {UserRole} from "../models/UserRole";
import {IModelWrapper} from "./IModelWrapper";

export class UserInfoWithAllModelWrapper implements IModelWrapper<User> {

  public name() {
    return "UserInfo";
  }

  public create(user: User, transaction: Transaction): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      User.create(user, {transaction}).then((user) => {
        UserRole.bulkCreate(user.roles.map((role) => ({
          userId: user.id,
          roleId: role.id,
        })))
          .then((userRoles) => resolve(user))
          .catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }

  public findAll(transaction: Transaction): Promise<User[]> {
    return User.findAll({
      attributes: {exclude: ["password"]},
      include: [{
        model: Role,
      }],
      transaction,
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: User[]; count: number; }> {
    return User.findAndCountAll({
      attributes: {exclude: ["password"]},
      include: [{
        model: Role,
      },{
        model: CustomerOrder,
      },{
        model: Address,
      }],
      transaction,
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<User> {
    return User.findById(identifier, {
      attributes: {exclude: ["password"]},
      include: [{
        model: Role,
      },{
        model: CustomerOrder,
      },{
        model: Address,
      }],
      transaction,
    });
  }

  public update(user: User, transaction: Transaction): Promise<[number, User[]]> {
    return new Promise<[number, User[]]>((resolve, reject) => reject());
  }

  public delete(value: User, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }
}
