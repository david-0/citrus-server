import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Location} from "./Location";
import {Order} from "./Order";

@Entity()
export class OpeningHour {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public fromDate: Date;

  @Column()
  public toDate: Date;

  @ManyToOne(type => Location, location => location.openingHours)
  public location: Location;

  @OneToMany(type => Order, order => order.plannedCheckout)
  public orders: Order[];


}
