import {ICreateOptions, IFindOptions} from "sequelize-typescript";
import * as Promise from "sequelize-typescript/node_modules/@types/bluebird";
import {UpdateOptions} from "sequelize-typescript/node_modules/@types/sequelize";
import {BulkOrder} from "../models/BulkOrder";
import {IModelWrapper} from "./IModelWrapper";

export class BulkOrderModelWrapper implements IModelWrapper<BulkOrder> {

  public name() {
    return "BulkOrder";
  }

  public filterColumns(): string[] {
    return [];
  }

  public create(values?: any, options?: ICreateOptions): Promise<BulkOrder> {
    return BulkOrder.create(values, options);
  }

  public findAll(options?: IFindOptions): Promise<BulkOrder[]> {
    return BulkOrder.findAll(options);
  }

  public findAndCountAll(options?: IFindOptions): Promise<{ rows: BulkOrder[]; count: number; }> {
    return BulkOrder.findAndCountAll(options);
  }

  public findById(identifier?: string | number, options?: IFindOptions): Promise<BulkOrder> {
    return BulkOrder.findById(identifier, options);
  }

  public update(values: any, options: UpdateOptions): Promise<[number, BulkOrder[]]> {
    return BulkOrder.update(values, options);
  }

}
