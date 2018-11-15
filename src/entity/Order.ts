import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {CheckedOutOrderItem} from "./CheckedOutOrderItem";
import {Location} from "./Location";
import {OpeningHour} from "./OpeningHour";
import {OrderItem} from "./OrderItem";
import {User} from "./User";

@Entity()
export class Order {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public date: Date;

  @ManyToOne(type => User, user => user.orders)
  public user: User;

  @ManyToOne(type => Location, location => location.orders, {nullable: true})
  public location: Location;

  @OneToMany(type => OrderItem, item => item.order, {cascade: true})
  public orderItems: OrderItem[];

  @Column("decimal", {precision: 10, scale: 2})
  public totalPrice: number;

  @ManyToOne(type => OpeningHour, openingHour => openingHour.orders, {nullable: true})
  public plannedCheckout: OpeningHour;

  @Column()
  public checkedOut: boolean;

  @OneToMany(type => CheckedOutOrderItem, item => item.order, {cascade: true})
  public checkedOutOrderItems: CheckedOutOrderItem[];

  @Column("decimal", {precision: 10, scale: 2, nullable: true})
  public checkedOutTotalPrice: number;

  @Column({nullable: true})
  public checkedOutDate: Date;

  @ManyToOne(type => User, user => user.orders, {nullable: true})
  public checkingOutUser: User;
}
