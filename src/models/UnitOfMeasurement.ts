import {IArticle, IUnitOfMeasurement} from "citrus-common";
import {Column, HasMany, Model, Table} from "sequelize-typescript";
import {Article} from "./Article";

@Table
export class UnitOfMeasurement extends Model<UnitOfMeasurement> implements IUnitOfMeasurement {

  @Column
  public shortcut: string;

  @Column
  public description: string;

  @HasMany(() => Article)
  public articles: IArticle[];
}
