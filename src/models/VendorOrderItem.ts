import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Article} from "./Article";
import {VendorOrder} from "./VendorOrder";

@Table
export class VendorOrderItem extends Model<VendorOrderItem> {
  @ForeignKey(() => VendorOrder)
  @Column
  public vendorOrderId: number;

  @BelongsTo(() => VendorOrder)
  public vendorOrder: VendorOrder;

  @ForeignKey(() => Article)
  @Column
  public ArticleId: number;

  @BelongsTo(() => Article)
  public article: Article;

  @Column
  public orderedQuantity: number;

  @Column
  public useableQuantity: number;

  @Column
  public comment: string;

}
