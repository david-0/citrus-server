import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ColumnNumericTransformer} from "../utils/ColumnNumericTransformer";
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

  @Column({default : ""})
  public comment: string;

  @ManyToOne(type => Location, location => location.orders, {nullable: true})
  public location: Location;

  @ManyToOne(type => User, user => user.orders)
  public user: User;

  @OneToMany(type => OrderItem, item => item.order, {cascade: true})
  public orderItems: OrderItem[];

  @Column("decimal", {precision: 10, scale: 2, transformer: new ColumnNumericTransformer()})
  public totalPrice: number;

  @ManyToOne(type => OpeningHour, openingHour => openingHour.orders, {nullable: true})
  public plannedCheckout: OpeningHour;

  @Column({nullable: true})
  public deliveryNoteCreated: Date;
}
