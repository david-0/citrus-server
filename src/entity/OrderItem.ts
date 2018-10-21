import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ArticleStock} from "./ArticleStock";
import {Order} from "./Order";
import {OrderLocation} from "./OrderLocation";

@Entity()
export class OrderItem {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => OrderLocation, order => order.orderItems)
  public orderLocation: OrderLocation;

  @ManyToOne(type => ArticleStock, stock => stock.orderItems)
  public articleStock: ArticleStock;

  /**
   * price per Unit
   */
  @Column("decimal", {precision: 10, scale: 2})
  public copiedPrice: number;

  @Column()
  public quantity: number;
}
