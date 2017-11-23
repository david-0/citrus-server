import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {Shipment} from "../models/Shipment";
import {IModelWrapper} from "./IModelWrapper";

export class ShipmentModelWrapper implements IModelWrapper<Shipment> {

  public name() {
    return "Shipment";
  }

  public create(values?: any, options?: ICreateOptions): Promise<Shipment> {
    return Shipment.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<Shipment[]> {
    return Shipment.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: Shipment[]; count: number; }> {
    return Shipment.findAndCountAll();
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<Shipment> {
    return Shipment.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, Shipment[]]> {
    return Shipment.update(values, options);
  }

}
