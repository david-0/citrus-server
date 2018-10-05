import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Location} from "./Location";

@Entity()
export class OpeningHour {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public fromDate: Date;

  @Column()
  public toDate: Date;

  @ManyToOne(type => Location, location => location.openingHours, {onDelete: "CASCADE"})
  public location: Location;

}
