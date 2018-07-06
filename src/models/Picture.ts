import {Column, IsUUID, Model, PrimaryKey, Table} from "sequelize-typescript";

@Table
export class Picture extends Model<Picture> {
  @PrimaryKey
  @Column
  public id: string;

  @Column
  public contentType: string;

  @Column
  public image: Buffer;
}
