import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {CustomerOrderItem} from "./CustomerOrderItem";
import {User} from "./User";

@Entity()
export class CustomerOrder {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public date: Date;

  @Column("decimal", {precision: 10, scale: 2})
  public totalPrice: number;

  @ManyToOne(type => User, user => user.customerOrders)
  public user: User;

  @OneToMany(type => CustomerOrderItem, item => item.customerOrder, {cascade: true})
  public customerOrderItems: CustomerOrderItem[];
}
