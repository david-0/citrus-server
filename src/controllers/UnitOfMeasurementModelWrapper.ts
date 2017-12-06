import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {UnitOfMeasurement} from "../models/UnitOfMeasurement";
import {IModelWrapper} from "./IModelWrapper";

export class UnitOfMeasurementModelWrapper implements IModelWrapper<UnitOfMeasurement> {

  public name() {
    return "UnitOfMeasurement";
  }

  public filterColumns(): string[] {
    return ["shortcut", "description"];
  }

  public create(values?: any, options?: ICreateOptions): Promise<UnitOfMeasurement> {
    return UnitOfMeasurement.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<UnitOfMeasurement[]> {
    return UnitOfMeasurement.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: UnitOfMeasurement[]; count: number; }> {
    return UnitOfMeasurement.findAndCountAll(options);
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<UnitOfMeasurement> {
    return UnitOfMeasurement.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, UnitOfMeasurement[]]> {
    return UnitOfMeasurement.update(values, options);
  }

}
