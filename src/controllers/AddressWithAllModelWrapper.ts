import * as Promise from "bluebird";
import {Transaction} from "sequelize";
import {Address} from "../models/Address";
import {Location} from "../models/Location";
import {User} from "../models/User";
import {IModelWrapper} from "./IModelWrapper";

export class AddressWithAllModelWrapper implements IModelWrapper<Address> {

  public name() {
    return "AddressWithUserInfo";
  }

  public create(value: Address, transaction: Transaction): Promise<Address> {
    return Address.create(value, {transaction});
  }

  public findAll(transaction: Transaction): Promise<Address[]> {
    return Address.findAll({
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, Location],
      transaction,
    });
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: Address[]; count: number; }> {
    return Address.findAndCountAll({
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, Location],
      transaction,
    });
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<Address> {
    return Address.findById(identifier, {
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }, Location],
      transaction,
    });
  }

  public update(value: Address, transaction: Transaction): Promise<[number, Address[]]> {
    return Address.update(value, {
      where: {id: value.id},
      transaction,
    });
  }

  public delete(value: Address, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }
}
