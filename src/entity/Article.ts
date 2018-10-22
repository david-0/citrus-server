import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {ArticleStock} from "./ArticleStock";
import {OrderItem} from "./OrderItem";
import {UnitOfMeasurement} from "./UnitOfMeasurement";

/**
 * Stammdaten
 */
@Entity()
export class Article {

  @PrimaryGeneratedColumn()
  public id: number;

  @Unique(["number"])
  @Column()
  public number: number;

  @Column()
  public description: string;

  @Column({nullable: true})
  public pictureId: string;

  @Column("decimal", {precision: 10, scale: 2})
  public price: number;

  @Column()
  public inSale: boolean;

  @ManyToOne(type => UnitOfMeasurement, unitOfMeasurement => unitOfMeasurement.articles)
  public unitOfMeasurement: UnitOfMeasurement;

  @OneToMany(type => ArticleStock, articleStock => articleStock.article)
  public articleStocks: ArticleStock[];

  @OneToMany(type => OrderItem, orderItem => orderItem.article)
  public orderItems: OrderItem[];
}
