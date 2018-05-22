import {Column, HasMany, Model, Table} from "sequelize-typescript";
import {Article} from "./Article";

@Table
export class UnitOfMeasurement extends Model<UnitOfMeasurement>{

  @Column
  public shortcut: string;

  @Column
  public description: string;

  @HasMany(() => Article)
  public articles: Article[];
}
