import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ArticleStock} from "./ArticleStock";
import {CustomerOrder} from "./CustomerOrder";

@Entity()
export class CustomerOrderItem {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => CustomerOrder, order => order.customerOrderItems)
  public customerOrder: CustomerOrder;

  @ManyToOne(type => ArticleStock, stock => stock.customerOrderItems)
  public articleStock: ArticleStock;

  @Column("decimal", {precision: 10, scale: 2})
  public copiedPrice: number;

  @Column()
  public quantity: number;

  @Column()
  public checkedOut: boolean;
}
