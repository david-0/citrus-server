import {Column, HasMany, Model, Table} from "sequelize-typescript";
import {ArticleStock} from "./ArticleStock";
import {OpeningHour} from "./OpeningHour";

@Table
export class Location extends Model<Location> {

  @Column
  public comment: string;

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

  @Column
  public description: string;

  @HasMany(() => ArticleStock)
  public articleStocks: ArticleStock[];

  @HasMany(() => OpeningHour)
  public openingHours: OpeningHour[];
}
