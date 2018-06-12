import * as Promise from "bluebird";
import {OpeningHour} from "../models/OpeningHour";
import {IModelWrapper} from "./IModelWrapper";

export class OpeningHourModelWrapper implements IModelWrapper<OpeningHour> {

  public name() {
    return "OpeningHour";
  }

  public create(values: OpeningHour): Promise<OpeningHour> {
    return OpeningHour.create(values);
  }

  public findAll(): Promise<OpeningHour[]> {
    return OpeningHour.findAll();
  }

  public findAndCountAll(): Promise<{ rows: OpeningHour[]; count: number; }> {
    return OpeningHour.findAndCountAll();
  }

  public findById(identifier?: string | number): Promise<OpeningHour> {
    return OpeningHour.findById(identifier);
  }

  public update(value: OpeningHour): Promise<[number, OpeningHour[]]> {
    return OpeningHour.update(value, {where: {id: value.id}});
  }

}
