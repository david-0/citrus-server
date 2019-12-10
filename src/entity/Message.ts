import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Message {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public sendDate: Date;

  @ManyToOne(type => User, user => user.sentMessages)
  public sendUser: User;

  @Column()
  public subject: string;

  @Column()
  public content: string;

  @ManyToMany(type => User, user => user.receivedMessages)
  public receivers: User[];

  @Column()
  public responses: string;
}
