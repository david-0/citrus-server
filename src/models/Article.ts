import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table, Unique} from "sequelize-typescript";
import {addAttributeOptions} from "sequelize-typescript/lib/services/models";
import {ArticleStock} from "./ArticleStock";
import {UnitOfMeasurement} from "./UnitOfMeasurement";

function ToNumber(target: any, propertyKey: string): any {
  addAttributeOptions(target, propertyKey, {
    get(): any {
      return +this.getDataValue(propertyKey);
    },
  });
}

/**
 * Stammdaten
 */
@Table
export class Article extends Model<Article> {
  @Column
  @Unique
  public number: number;

  @Column
  public description: string;

  @Column
  public pictureId: string;

  @ToNumber
  @Column({type: DataType.DECIMAL(10, 2)})
  public price: number;

  @Column
  public inSale: boolean;

  @ForeignKey(() => UnitOfMeasurement)
  @Column
  public unitOfMeasurementId: number;

  @BelongsTo(() => UnitOfMeasurement)
  public unitOfMeasurement: UnitOfMeasurement;

  @HasMany(() => ArticleStock)
  public articleStocks: ArticleStock[];
}
