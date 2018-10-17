import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Location} from "./Location";
import {OrderLocation} from "./OrderLocation";

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

  @OneToMany(type => OrderLocation, orderLocation => orderLocation.plannedCheckout)
  public orderLocations: OrderLocation[];


}
