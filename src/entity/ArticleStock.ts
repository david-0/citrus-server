import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {ColumnNumericTransformer} from "../utils/ColumnNumericTransformer";
import {Article} from "./Article";
import {ArticleCheckIn} from "./ArticleCheckIn";
import {ArticleCheckOut} from "./ArticleCheckOut";
import {Location} from "./Location";

/**
 * Lagerbestand pro Standort
 */
@Entity()
@Unique(["article", "location"])
export class ArticleStock {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Article, article => article.articleStocks)
  public article: Article;

  /**
   * Stock is a computed(redundant) column with the following formula:
   * <ul>
   *     <li>plus all CheckIn quantities (in the past)</li>
   *     <li>minus all Checkout quantities (in the past)</li>
   *     <li>minus all OrderItem[checkedOut=true] quantities</li>
   * </ul>
   * When a Order is archived, then it is marked as checkedOut=true and the quantities are removed from the articleStock.
   */
  @Column("decimal", {precision: 10, scale: 1, transformer: new ColumnNumericTransformer()})
  public quantity: number;

  /**
   * Reserved is a computed(redundant) column with the following formula:
   * <ul>
   *     <li>plus all OrderItem[checkedOut=false] quantities</li>
   *     <li>plus all Checkout quantities(in the future)</li>
   * </ul>
   */
  @Column("decimal", {precision: 10, scale: 1, transformer: new ColumnNumericTransformer()})
  public reservedQuantity: number;

  @Column( {default : "false"})
  public soldOut: boolean;

  @Column( {default : "false"})
  public visible: boolean;

  @OneToMany(type => ArticleCheckIn, checkin => checkin.articleStock)
  public checkIns: ArticleCheckIn[];

  @OneToMany(type => ArticleCheckOut, checkout => checkout.articleStock)
  public checkOuts: ArticleCheckOut[];

  @ManyToOne(type => Location, location => location.id)
  public location: Location;
}
