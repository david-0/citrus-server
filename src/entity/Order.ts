import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {OrderItem} from "./OrderItem";
import {OrderLocation} from "./OrderLocation";
import {User} from "./User";

@Entity()
export class Order {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public date: Date;

  @Column("decimal", {precision: 10, scale: 2})
  public totalPrice: number;

  @ManyToOne(type => User, user => user.orders)
  public user: User;

  @OneToMany(type => OrderLocation, location => location.order, {cascade: true})
  public orderLocations: OrderLocation[];

  @Column()
  public completed: boolean;

  @Column({nullable: true})
  public completedDate: Date;
}
