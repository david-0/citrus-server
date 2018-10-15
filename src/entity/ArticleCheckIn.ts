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
  public plannedDate: Date;

  @Column()
  public comment: string;

  @Column()
  public done: boolean;

  @Column({nullable: true})
  public doneDate: Date;

  @ManyToOne(type => User, user => user.articleCheckIns, {nullable: true})
  public doneUser: User;
}
