import { RoleDto } from "citrus-common";
import { Role } from "../entity/Role";
import { UserConverter } from "./UserConverter";

export class RoleConverter {
    public static toDtos(input: Role[]): RoleDto[] {
        return input.map(a => RoleConverter.toDto(a));
    }

    public static toEntities(input: RoleDto[]): Role[] {
        return input.map(a => RoleConverter.toEntity(a));
    }

    public static toDto(input: Role): RoleDto {
        const result = RoleDto.createEmpty();
        result.id = input.id;
        result.name = input.name;
        if (input.users !== undefined && input.users !== null) {
            result.users = UserConverter.toDtos(input.users);
        }
        return result;
    }

    public static toEntity(input: RoleDto): Role {
        const result = new Role();
        result.id = input.id;
        result.name = input.name;
        return result;
    }
}