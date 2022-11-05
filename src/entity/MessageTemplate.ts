import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class MessageTemplate {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public subject: string;

  @Column()
  public content: string;
}
