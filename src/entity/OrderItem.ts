import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
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
  @Column("decimal", {precision: 10, scale: 2})
  public copiedPrice: number;

  @Column()
  public quantity: number;
}
