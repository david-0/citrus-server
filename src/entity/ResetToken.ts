import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class ResetToken {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public token: string;

  @ManyToOne(type => User, user => user.resetToken)
  public user: User;

  @Column()
  public validTo: Date;
}
