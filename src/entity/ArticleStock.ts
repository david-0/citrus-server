import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {ColumnNumericTransformer} from "../utils/ColumnNumericTransformer";
import {Article} from "./Article";
import {Location} from "./Location";

/**
 * Lagerbestand pro Standort
 */
@Entity()
@Unique(["article", "location"])
export class ArticleStock {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Article, article => article.articleStocks)
  public article: Article;

  @Column("decimal", {precision: 10, scale: 1, transformer: new ColumnNumericTransformer()})
  public quantity: number;

  @Column("decimal", {precision: 10, scale: 1, transformer: new ColumnNumericTransformer()})
  public reservedQuantity: number;

  @Column( {default : "false"})
  public soldOut: boolean;

  @Column( {default : "false"})
  public visible: boolean;

  @ManyToOne(type => Location, location => location.id)
  public location: Location;
}
