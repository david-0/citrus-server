import {IRole} from "citrus-common";
import {BelongsToMany, Column, Model, Table} from "sequelize-typescript";
import {User} from "./User";
import {UserRole} from "./UserRole";

@Table
export class Role extends Model<Role> implements IRole {

  @Column
  public name: string;

  @BelongsToMany(() => User, () => UserRole)
  public roles: User[];

}
