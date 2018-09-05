import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Article} from "./Article";
import {ArticleStock} from "./ArticleStock";
import {CustomerOrderItem} from "./CustomerOrderItem";
import {Location} from "./Location";
import {User} from "./User";

/**
 * Artikel Einbuchen
 */
@Table
export class ArticleCheckIn extends Model<ArticleCheckIn> {
  @ForeignKey(() => ArticleStock)
  @Column
  public articleStockId: number;

  @BelongsTo(() => ArticleStock)
  public articleStock: ArticleStock;

  @Column
  public quantity: number;

  @Column
  public date: Date;

  @Column
  public comment: string;

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User)
  public user: User;
}
