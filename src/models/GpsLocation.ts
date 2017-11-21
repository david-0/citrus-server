import {Column, HasOne, Model, Table} from "sequelize-typescript";
import {IAddress} from "../entities/IAddress";
import {IGpsLocation} from "../entities/IGpsLocation";
import {Address} from "./Address";

@Table
export class GpsLocation extends Model<GpsLocation> implements IGpsLocation{

  @Column
  public length: number;

  @Column
  public width: number;

  @HasOne(() => Address)
  public address: IAddress;
}
