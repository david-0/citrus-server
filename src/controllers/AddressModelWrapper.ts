import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {Transaction} from "sequelize-typescript/node_modules/@types/sequelize";
import {Address} from "../models/Address";
import {IModelWrapper} from "./IModelWrapper";

export class AddressModelWrapper implements IModelWrapper<Address> {

  public name() {
    return "Address";
  }

  public create(values: Address, transaction: Transaction): Promise<Address> {
    return Address.create(values, {transaction});
  }

  public findAll(transaction: Transaction): Promise<Address[]> {
    return Address.findAll({transaction});
  }

  public findAndCountAll(transaction: Transaction): Promise<{ rows: Address[]; count: number; }> {
    return Address.findAndCountAll({transaction});
  }

  public findById(identifier: string | number, transaction: Transaction): Promise<Address> {
    return Address.findById(identifier, {transaction});
  }

  public update(value: Address): Promise<[number, Address[]]> {
    return Address.update(value, {where: {id: value.id}});
  }

  public delete(value: Address, transaction: Transaction): Promise<void> {
    return value.destroy({transaction});
  }
}
