import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {ArticleStock} from "./ArticleStock";
import {User} from "./User";

/**
 * Artikel Ausbuchen
 */
@Table
export class ArticleCheckOut extends Model<ArticleCheckOut> {
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
