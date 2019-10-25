import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {User} from "./User";

@Entity()
export class UserNotConfirmed {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public token: string;

  @Column()
  public name: string;

  @Column()
  public prename: string;

  @Column()
  public phoneNumber: string;

  @Column()
  @Unique(["email"])
  public email: string;

  @Column()
  public validTo: Date;
}
