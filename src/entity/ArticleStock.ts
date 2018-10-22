import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Article} from "./Article";
import {ArticleCheckIn} from "./ArticleCheckIn";
import {ArticleCheckOut} from "./ArticleCheckOut";
import {OrderItem} from "./OrderItem";
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
   *     <li>minus all CustomerOrderItem[checkedOut=true] quantities</li>
   * </ul>
   */
  @Column()
  public quantity: number;

  /**
   * Reserved is a computed(redundant) column with the following formula:
   * <ul>
   *     <li>plus all CustomerOrderItem[checkedOut=false] quantities</li>
   *     <li>plus all Checkout quantities(in the future)</li>
   * </ul>
   */
  @Column()
  public reservedQuantity: number;

  @OneToMany(type => ArticleCheckIn, checkin => checkin.articleStock)
  public checkIns: ArticleCheckIn[];

  @OneToMany(type => ArticleCheckOut, checkout => checkout.articleStock)
  public checkOuts: ArticleCheckOut[];

  @ManyToOne(type => Location, location => location.id)
  public location: Location;
}
