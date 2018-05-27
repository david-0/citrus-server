import * as Promise from "bluebird";
import {Address} from "../models/Address";
import {User} from "../models/User";
import {IModelWrapper} from "./IModelWrapper";

export class AddressWithUserInfoModelWrapper implements IModelWrapper<Address> {

  public name() {
    return "Address";
  }

  public create(values?: any): Promise<Address> {
    return Address.create(values);
  }

  public findAll(): Promise<Address[]> {
    return Address.findAll({
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }],
    });
  }

  public findAndCountAll(): Promise<{ rows: Address[]; count: number; }> {
    return Address.findAndCountAll({
      include: [{
        attributes: {exclude: ["password"]},
        model: User,
      }],
    });
  }

  public findById(identifier?: string | number): Promise<Address> {
    return Address.findById(identifier);
  }

  public update(value: Address): Promise<[number, Address[]]> {
    return Address.update(value, {
      where: {id: value.id},
      fields: ["name", "prename", "street", "number", "addition", "zipcode", "city", "userId", "description", "gpsLocationId"],
    });
  }
}
