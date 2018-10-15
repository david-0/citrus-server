import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ArticleStock} from "./ArticleStock";
import {User} from "./User";

/**
 * Artikel Ausbuchen
 */

@Entity()
export class ArticleCheckOut {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => ArticleStock, articleStock => articleStock.checkOuts)
  public articleStock: ArticleStock;

  @Column()
  public quantity: number;

  @Column()
  public plannedDate: Date;

  @Column()
  public comment: string;

  @Column()
  public done: boolean;

  @Column({nullable: true})
  public doneDate: Date;

  @ManyToOne(type => User, user => user.articleCheckOuts, { nullable: true })
  public doneUser: User;
}
