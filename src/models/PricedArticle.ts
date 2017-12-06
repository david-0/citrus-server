import {IArticle, ICustomerOrderItem, IPricedArticle} from "citrus-common";
import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Article} from "./Article";
import {CustomerOrderItem} from "./CustomerOrderItem";

@Table
export class PricedArticle extends Model<PricedArticle> implements IPricedArticle {
  @ForeignKey(() => Article)
  @Column
  public articleId: number;

  @BelongsTo(() => Article)
  public article: IArticle;

  @Column
  public price: number;

  @Column
  public validFrom: Date;

  @Column
  public validTo: Date;

  @HasMany(() => CustomerOrderItem)
  public customOrderItems: ICustomerOrderItem[];
}
