import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Role} from "./Role";
import {User} from "./User";

@Table
export class UserRole extends Model<UserRole> {

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @ForeignKey(() => Role)
  @Column
  public roleId: number;
}
