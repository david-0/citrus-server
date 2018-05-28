import * as Promise from "bluebird";
import {UnitOfMeasurement} from "../models/UnitOfMeasurement";
import {IModelWrapper} from "./IModelWrapper";

export class UnitOfMeasurementModelWrapper implements IModelWrapper<UnitOfMeasurement> {

  public name() {
    return "UnitOfMeasurement";
  }

  public create(value: UnitOfMeasurement): Promise<UnitOfMeasurement> {
    return UnitOfMeasurement.create(value);
  }

  public findAll(): Promise<UnitOfMeasurement[]> {
    return UnitOfMeasurement.findAll();
  }

  public findAndCountAll(): Promise<{ rows: UnitOfMeasurement[]; count: number; }> {
    return UnitOfMeasurement.findAndCountAll();
  }

  public findById(identifier?: string | number): Promise<UnitOfMeasurement> {
    return UnitOfMeasurement.findById(identifier);
  }

  public update(value: UnitOfMeasurement): Promise<[number, UnitOfMeasurement[]]> {
    return UnitOfMeasurement.update(value, {where: {id: value.id}});
  }

}
