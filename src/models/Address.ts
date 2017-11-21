import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {IAddress} from "../entities/IAddress";
import {IGpsLocation} from "../entities/IGpsLocation";
import {IOrder} from "../entities/IOrder";
import {GpsLocation} from "./GpsLocation";
import {Order} from "./Order";

@Table
export class Address extends Model<Address> implements IAddress {

  @Column
  public name: string;

  @Column
  public prename: string;

  @ForeignKey(() => GpsLocation)
  @Column
  public gpsLocationId: number;

  @BelongsTo(() => GpsLocation)
  public gpsLocation: IGpsLocation;

  @Column
  public street: string;

  @Column
  public number: string;

  @Column
  public plz: string;

  @Column
  public city: string;

  @HasMany(() => Order)
  public orders: IOrder[];
}
