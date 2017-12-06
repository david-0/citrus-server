import {ICustomerOrderItem, IPricedArticle} from "citrus-common";
import {BelongsTo, Column, ForeignKey, HasOne, Model, Table} from "sequelize-typescript";
import {CustomerOrder} from "./CustomerOrder";
import {PricedArticle} from "./PricedArticle";

@Table
export class CustomerOrderItem extends Model<CustomerOrderItem> implements ICustomerOrderItem {

  @ForeignKey(() => CustomerOrder)
  @Column
  public customerOrderId: number;

  @BelongsTo(() => CustomerOrder)
  public customerOrder: CustomerOrder;

  @ForeignKey(() => PricedArticle)
  @Column
  public pricedArticleId: number;

  @BelongsTo(() => PricedArticle)
  public pricedArticle: IPricedArticle;

  @Column
  public quantity: number;
}
