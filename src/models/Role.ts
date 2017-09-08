import {BelongsToMany, Column, Model, Table} from "sequelize-typescript";
import {IRole} from "../entities/IRole";
import {User} from "./User";
import {UserRole} from "./UserRole";

@Table
export class Role extends Model<Role> implements IRole {

  @Column
  public name: string;

  @BelongsToMany(() => User, () => UserRole)
  public roles: User[];

}
