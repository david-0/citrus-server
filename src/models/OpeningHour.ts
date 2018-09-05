import {BelongsTo, Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Location} from "./Location";

@Table
export class OpeningHour extends Model<OpeningHour> {
  @Column
  public fromDate: Date;

  @Column
  public toDate: Date;

  @ForeignKey(() => Location)
  @Column
  public locationId: number;

  @BelongsTo(() => Location, { onDelete: "cascade" })
  public location: Location;

}
