import * as Promise from "bluebird";
import {Address} from "../models/Address";
import {User} from "../models/User";
import {IModelWrapper} from "./IModelWrapper";

export class AddressModelWrapper implements IModelWrapper<Address> {

  public name() {
    return "Address";
  }

  public create(values: Address): Promise<Address> {
    return Address.create(values);
  }

  public findAll(): Promise<Address[]> {
    return Address.findAll();
  }

  public findAndCountAll(): Promise<{ rows: Address[]; count: number; }> {
    return Address.findAndCountAll();
  }

  public findById(identifier?: string | number): Promise<Address> {
    return Address.findById(identifier);
  }

  public update(value: Address): Promise<[number, Address[]]> {
    return Address.update(value, {where: {id: value.id}});
  }

}
