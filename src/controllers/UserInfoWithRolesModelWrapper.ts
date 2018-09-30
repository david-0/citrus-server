import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";
import {Role} from "../models/Role";
import {User} from "../models/User";
import {UserRole} from "../models/UserRole";
import {IModelWrapper} from "./IModelWrapper";

export class UserInfoWithRolesModelWrapper implements IModelWrapper<User> {

  public name() {
    return "User";
  }

  public create(user: User, transaction: Transaction): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      User.create(user, {transaction}).then((createdUser) => {
        UserRole.bulkCreate(user.roles.map((role) => ({
          roleId: role.id,
          userId: createdUser.id,
        })), {transaction})
          .then(() => resolve(createdUser))
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
      }],
      transaction,
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<User> {
    return User.findById(identifier, {
      attributes: {exclude: ["password"]},
      include: [{
        model: Role,
      }],
      transaction,
    });
  }

  public update(user: User, transaction: Transaction): Promise<[number, User[]]> {
    return new Promise<[number, User[]]>((resolve, reject) => {
      User.findById(user.id,
        {
          attributes: {include: ["id"]},
          include: [{
            model: Role,
          }],
          transaction,
        }).then((oldUser) => {
        const rolesToRemove = this.firstWithoutSecond(oldUser.roles, user.roles).map((role) => role.id);
        const rolesToCreate = this.firstWithoutSecond(user.roles, oldUser.roles).map((role) => role.id);
        const toDelelePromise = UserRole.destroy({
          transaction,
          where: {userId: user.id, $and: {roleId: {$in: rolesToRemove}}},
        });
        const toCreatePromise = UserRole.bulkCreate(rolesToCreate.map((roleId) => ({
          roleId,
          userId: user.id,
        })), {transaction});
        const userUpdatePromise = User.update(user, {
          fields: ["number", "email", "name", "prename", "phone", "mobile"],
          transaction,
          where: {id: user.id},
        });
        Promise.all([userUpdatePromise, toDelelePromise, toCreatePromise]).then((results) => resolve(results[0]));
      }).catch((error) => reject(error));
    });
  }

  public delete(value: User, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }

  private firstWithoutSecond(oldRoles: Role[], newRoles: Role[]): Role[] {
    return oldRoles.filter((oldRole) => !newRoles.find((newRole) => newRole.name === oldRole.name));
  }
}
