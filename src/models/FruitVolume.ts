import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Fruit} from "./Fruit";
import {Transport} from "./Transport";

@Table
export class FruitVolume extends Model<FruitVolume> {

  @ForeignKey(() => Fruit)
  @Column
  public fruitId: number;

  @BelongsTo(() => Fruit)
  public fruit: Fruit;

  @Column
  public weightInKg: number;

  @ForeignKey(() => Transport)
  @Column
  public transportId: number;

  @BelongsTo(() => Transport)
  public transport: Transport;
}
