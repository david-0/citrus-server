import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class OrderArchive {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public archiveDate: Date;

  @Column()
  public archiveUser: string;

  @Column()
  public order: string;
}
