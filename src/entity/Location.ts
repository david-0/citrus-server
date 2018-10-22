import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ArticleStock} from "./ArticleStock";
import {OpeningHour} from "./OpeningHour";
import {Order} from "./Order";

@Entity()
export class Location {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public comment: string;

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

  @Column()
  public description: string;

  @OneToMany(type => ArticleStock, stock => stock.location)
  public articleStocks: ArticleStock[];

  @OneToMany(type => Order, order => order.location)
  public orders: Order[];

  @OneToMany(type => OpeningHour, openingHour => openingHour.location)
  public openingHours: OpeningHour[];
}
