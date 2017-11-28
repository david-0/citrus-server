import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {Address} from "../models/Address";
import {IModelWrapper} from "./IModelWrapper";

export class AddressModelWrapper implements IModelWrapper<Address> {
  public name() {
    return "Address";
  }

  public filterColumns(): string[] {
    return ["name", "prename", "street", "number", "plz", "city"];
  }

  public create(values?: any, options?: ICreateOptions): Promise<Address> {
    return Address.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<Address[]> {
    return Address.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: Address[]; count: number; }> {
    return Address.findAndCountAll(options);
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<Address> {
    return Address.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, Address[]]> {
    return Address.update(values, options);
  }

}
