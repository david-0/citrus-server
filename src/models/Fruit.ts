import {AutoIncrement, Column, HasMany, Model, PrimaryKey, Table} from "sequelize-typescript";
import {IFruit} from "../entities/IFruit";
import {FruitVolume} from "./FruitVolume";

@Table
export class Fruit extends Model<Fruit> implements IFruit {

  @Column
  public name: string;

  @HasMany(() => FruitVolume)
  public fruitVolumes: FruitVolume[];

}
