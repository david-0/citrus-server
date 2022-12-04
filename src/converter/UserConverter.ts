import { UserDto } from "citrus-common";
import { User } from "../entity/User";
import { RoleConverter } from "./RoleConverter";

export class UserConverter {

  public static toDtos(input: User[]): UserDto[] {
    return input.map(a => UserConverter.toDto(a));
  }

  public static toEntities(input: UserDto[]): User[] {
    return input.map(a => UserConverter.toEntity(a));
  }

  public static toDto(input: User): UserDto {
    const result = UserDto.createEmpty();
    result.id = input.id;
    result.email = input.email;
    result.name = input.name;
    result.prename = input.prename;
    result.phone = input.phone;
    if (input.roles !== undefined && input.roles !== null) {
      result.roles = RoleConverter.toDtos(input.roles);
    }
    return result;
  }

  public static toEntity(input: UserDto): User {
    const result = new User();
    result.id = input.id;
    result.id = input.id;
    result.email = input.email;
    result.name = input.name;
    result.prename = input.prename;
    result.phone = input.phone;
    if (input.roles !== undefined && input.roles !== null) {
      result.roles = RoleConverter.toEntities(input.roles);
    }
    return result;
  }
}
