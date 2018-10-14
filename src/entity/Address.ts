import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Address {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => User, user => user.addresses, {cascade: true})
  public user: User;

  @Column()
  public description: string;

  @Column()
  public name: string;

  @Column()
  public prename: string;

  @Column()
  public street: string;

  @Column()
  public number: string;

  @Column()
  public addition: string;

  @Column()
  public zipcode: string;

  @Column()
  public city: string;
}
