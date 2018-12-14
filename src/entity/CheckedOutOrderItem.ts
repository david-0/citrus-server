import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Article} from "./Article";
import {Order} from "./Order";

@Entity()
export class CheckedOutOrderItem {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Order, order => order.checkedOutOrderItems, {onDelete: "CASCADE"})
  public order: Order;

  @ManyToOne(type => Article, article => article.checkedOutOrderItems)
  public article: Article;

  /**
   * price per Unit
   */
  @Column("decimal", {precision: 10, scale: 2})
  public copiedPrice: number;

  @Column()
  public quantity: number;
  // desiredQuantity
  // provConfirmedQuantity
  // confirmedQuantity
  // fetchedQuantity
}
