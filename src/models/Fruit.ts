import {Column, HasMany, Model, Table} from "sequelize-typescript";
import {FruitVolume} from "./FruitVolume";

@Table
export class Fruit extends Model<Fruit> {

  @Column
  public name: string;

  @HasMany(() => FruitVolume)
  public fruitVolumes: FruitVolume[];

}
