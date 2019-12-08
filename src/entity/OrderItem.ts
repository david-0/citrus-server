import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ColumnNumericTransformer} from "../utils/ColumnNumericTransformer";
import {Article} from "./Article";
import {Order} from "./Order";

@Entity()
export class OrderItem {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Order, order => order.orderItems, {onDelete: "CASCADE"})
  public order: Order;

  @ManyToOne(type => Article, article => article.orderItems)
  public article: Article;

  /**
   * price per Unit
   */
  @Column("decimal", {precision: 10, scale: 2, transformer: new ColumnNumericTransformer()})
  public copiedPrice: number;

  @Column("decimal", {precision: 10, scale: 1, transformer: new ColumnNumericTransformer()})
  public quantity: number;
  // desiredQuantity
  // provConfirmedQuantity
  // confirmedQuantity
  // fetchedQuantity
}
