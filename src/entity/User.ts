import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Address} from "./Address";
import {ArticleCheckIn} from "./ArticleCheckIn";
import {ArticleCheckOut} from "./ArticleCheckOut";
import {Order} from "./Order";
import {OrderLocation} from "./OrderLocation";
import {Role} from "./Role";

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

  @Column()
  public name: string;

  @Column()
  public prename: string;

  @Column()
  public phone: string;

  @Column()
  public mobile: string;

  @OneToMany(type => Order, order => order.user)
  public orders: Order[];

  @OneToMany(type => OrderLocation, orderLocation => orderLocation.checkingOutUser)
  public orderLocations: OrderLocation[];

  @OneToMany(type => ArticleCheckIn, checkIn => checkIn.doneUser)
  public articleCheckIns: ArticleCheckIn[];

  @OneToMany(type => ArticleCheckOut, checkOut => checkOut.doneUser)
  public articleCheckOuts: ArticleCheckOut[];

  @OneToMany(type => Address, address => address.user)
  public addresses: Address[];
}
