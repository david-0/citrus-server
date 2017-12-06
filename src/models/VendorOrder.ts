import {IVendorOrder, IVendorOrderItem} from "citrus-common";
import {Column, HasMany, Model, Table} from "sequelize-typescript";
import {VendorOrderItem} from "./VendorOrderItem";

@Table
export class VendorOrder extends Model<VendorOrder> implements IVendorOrder {

  @Column
  public number: number;

  @Column
  public comment: string;

  @Column
  public arrivalDate: Date;

  @Column
  public saleDate: Date;

  @HasMany(() => VendorOrderItem)
  public vendorOrderItems: IVendorOrderItem[];
}
