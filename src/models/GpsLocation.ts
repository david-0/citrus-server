import {IAddress, IGpsLocation} from "citrus-common";
import {Column, HasOne, Model, Table} from "sequelize-typescript";
import {Address} from "./Address";

@Table
export class GpsLocation extends Model<GpsLocation> implements IGpsLocation {

  @Column
  public latitude: number;

  @Column
  public longitude: number;

  @HasOne(() => Address)
  public address: IAddress;
}
