import {Column, HasMany, Model, Table} from "sequelize-typescript";
import {FruitVolume} from "./FruitVolume";

@Table
export class Transport extends Model<Transport> {

  @Column
  public departureDate: Date;

  @HasMany(() => FruitVolume)
  public fruitVolumes: FruitVolume[];
}
