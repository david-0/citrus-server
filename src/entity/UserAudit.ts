import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class UserAudit {
  @PrimaryGeneratedColumn()
  public id?: number;

  @ManyToOne(type => User, user => user.audits)
  public user: User;

  @Column()
  public date?: Date;

  @Column()
  public action: string;

  @Column()
  public actionResult: string;

  @Column({nullable: true})
  public additionalData: string;

  @Column()
  public ip?: string;

  @Column()
  public userAgent?: string;
}
