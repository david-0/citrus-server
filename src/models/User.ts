import {BelongsToMany, Column, Model, PrimaryKey, Table} from "sequelize-typescript";
import {IUser} from "../entities/IUser";
import {Role} from "./Role";
import {UserRole} from "./UserRole";

@Table
export class User extends Model<User> implements IUser {

  @Column
  public email: string;

  @Column
  public password: string;

  @BelongsToMany(() => Role, () => UserRole)
  public roles: Role[];
}
