import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Article} from "./Article";
import {CustomerOrder} from "./CustomerOrder";

@Table
export class CustomerOrderItem extends Model<CustomerOrderItem> {

  @ForeignKey(() => CustomerOrder)
  @Column
  public customerOrderId: number;

  @BelongsTo(() => CustomerOrder)
  public customerOrder: CustomerOrder;

  @ForeignKey(() => Article)
  @Column
  public articleId: number;

  @BelongsTo(() => Article)
  public article: Article;

  @Column({type: DataType.DECIMAL(10, 2)})
  public copiedPrice: number;

  @Column
  public quantity: number;
}
