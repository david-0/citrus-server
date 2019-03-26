import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Image {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public contentType: string;

  @Column("bytea")
  public image: Buffer;
}
