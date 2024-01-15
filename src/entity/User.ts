import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Message} from "./Message";
import {Order} from "./Order";
import {ResetToken} from "./ResetToken";
import {Role} from "./Role";
import {UserAudit} from "./UserAudit";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Unique(["email"])
  @Column()
  public email: string;

  @Column({select: false, nullable: true})
  public password: string;

  @ManyToMany(type => Role, role => role.users)
  @JoinTable()
  public roles: Role[];

  @OneToMany(type => ResetToken, resetToken => resetToken.token, {cascade: true})
  public resetToken?: ResetToken[];

  @OneToMany(type => UserAudit, userAudit => userAudit.user, {cascade: true})
  public audits?: UserAudit[];

  @Column()
  public name: string;

  @Column()
  public prename: string;

  @Column()
  public phone: string;

  @OneToMany(type => Order, order => order.user)
  public orders: Order[];

  @ManyToMany(type => Message, message => message.receivers)
  @JoinTable()
  public receivedMessages: Message[];

  @OneToMany(type => Message, message => message.sendUser)
  public sentMessages: Message[];

}
