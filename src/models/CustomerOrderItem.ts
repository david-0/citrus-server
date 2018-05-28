import {BelongsTo, Column, ForeignKey, HasOne, Model, Table} from "sequelize-typescript";
import {CustomerOrder} from "./CustomerOrder";
import {PricedArticle} from "./PricedArticle";

@Table
export class CustomerOrderItem extends Model<CustomerOrderItem> {

  @ForeignKey(() => CustomerOrder)
  @Column
  public customerOrderId: number;

  @BelongsTo(() => CustomerOrder)
  public customerOrder: CustomerOrder;

  @ForeignKey(() => PricedArticle)
  @Column
  public pricedArticleId: number;

  @BelongsTo(() => PricedArticle)
  public pricedArticle: PricedArticle;

  @Column
  public copiedPrice: number;

  @Column
  public quantity: number;
}
