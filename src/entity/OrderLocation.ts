import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Location} from "./Location";
import {OpeningHour} from "./OpeningHour";
import {Order} from "./Order";
import {OrderItem} from "./OrderItem";
import {User} from "./User";

@Entity()
export class OrderLocation {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Order, order => order.orderLocations)
  public order: Order;

  @ManyToOne(type => Location, location => location.orderLocations, {nullable: true})
  public location: Location;

  @OneToMany(type => OrderItem, item => item.orderLocation, {cascade: true})
  public orderItems: OrderItem[];

  @Column("decimal", {precision: 10, scale: 2})
  public totalLocationPrice: number;

  @ManyToOne(type => OpeningHour, openingHour => openingHour.orderLocations, {nullable: true})
  public plannedCheckout: OpeningHour;

  @Column()
  public checkedOut: boolean;

  @Column({nullable: true})
  public checkedOutDate: Date;

  @ManyToOne(type => User, user => user.orderLocations, {nullable: true})
  public checkingOutUser: User;
}
