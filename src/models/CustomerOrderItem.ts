import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ArticleStock} from "./ArticleStock";
import {CustomerOrder} from "./CustomerOrder";

@Table
export class CustomerOrderItem extends Model<CustomerOrderItem> {

  @ForeignKey(() => CustomerOrder)
  @Column
  public customerOrderId: number;

  @BelongsTo(() => CustomerOrder)
  public customerOrder: CustomerOrder;

  @ForeignKey(() => ArticleStock)
  @Column
  public articleStockId: number;

  @BelongsTo(() => ArticleStock)
  public articleStock: ArticleStock;

  @Column({type: DataType.DECIMAL(10, 2)})
  public copiedPrice: number;

  @Column
  public quantity: number;

  @Column
  public checkedOut: boolean;
}
