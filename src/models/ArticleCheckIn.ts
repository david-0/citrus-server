import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ArticleStock} from "./ArticleStock";
import {User} from "./User";

/**
 * Artikel Einbuchen
 */
@Entity()
export class ArticleCheckIn {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => ArticleStock, articleStock => articleStock.checkIns)
  public articleStock: ArticleStock;

  @Column()
  public quantity: number;

  @Column()
  public date: Date;

  @Column()
  public done: boolean;

  @Column()
  public comment: string;

  @ManyToOne(type => User, user => user.articleCheckIns)
  public user: User;
}
