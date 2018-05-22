import {Column, HasOne, Model, Table} from "sequelize-typescript";
import {Address} from "./Address";

@Table
export class GpsLocation extends Model<GpsLocation> {

  @Column
  public latitude: number;

  @Column
  public longitude: number;

  @HasOne(() => Address)
  public address: Address;
}
