import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Article} from "./Article";

@Entity()
export class UnitOfMeasurement {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public shortcut: string;

  @Column()
  public description: string;

  @OneToMany(type => Article, article => article.unitOfMeasurement)
  public articles: Article[];
}
