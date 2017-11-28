import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {Delivery} from "../models/Delivery";
import {IModelWrapper} from "./IModelWrapper";

export class DeliveryModelWrapper implements IModelWrapper<Delivery> {

  public name() {
    return "Delivery";
  }

  public filterColumns(): string[] {
    return ["comment"];
  }

  public create(values?: any, options?: ICreateOptions): Promise<Delivery> {
    return Delivery.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<Delivery[]> {
    return Delivery.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: Delivery[]; count: number; }> {
    return Delivery.findAndCountAll(options);
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<Delivery> {
    return Delivery.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, Delivery[]]> {
    return Delivery.update(values, options);
  }

}
