import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Article} from "./Article";
import {CustomerOrderItem} from "./CustomerOrderItem";

@Table
export class PricedArticle extends Model<PricedArticle> {
  @ForeignKey(() => Article)
  @Column
  public articleId: number;

  @BelongsTo(() => Article)
  public article: Article;

  @Column
  public price: number;

  @Column
  public validFrom: Date;

  @Column
  public validTo: Date;

  @HasMany(() => CustomerOrderItem)
  public customOrderItems: CustomerOrderItem[];
}
