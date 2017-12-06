import {IAddress, IGpsLocation, IUser} from "citrus-common";
import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {GpsLocation} from "./GpsLocation";
import {User} from "./User";

@Table
export class Address extends Model<Address> implements IAddress {
  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User)
  public user: IUser;

  @Column
  public description: string;

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
  public addition: string;

  @Column
  public zipcode: string;

  @Column
  public city: string;
}
