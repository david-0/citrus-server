import { AddressDto } from "citrus-common";
import { Address } from "../entity/Address";
import { User } from "../entity/User";
import { ConverterUtil } from "./ConverterUtil";
import { UserConverter } from "./UserConverter";

export class AddressConverter {

    public static toDtos(input: Address[]): AddressDto[] {
        return input.map(a => AddressConverter.toDto(a));
    }

    public static toEntities(input: AddressDto[]): Address[] {
        return input.map(a => AddressConverter.toEntity(a));
    }

    public static toDto(input: Address): AddressDto {
        const result = AddressDto.createEmpty();
        result.id = input.id;
        if (input.user !== undefined && input.user !== null) {
            result.user = UserConverter.toDto(input.user);
        } else {
            delete input.user;
        }
        result.description = input.description;
        result.name = input.name;
        result.prename = input.prename;
        result.street = input.street;
        result.number = input.number;
        result.addition = input.addition;
        result.zipcode = input.zipcode;
        result.city = input.city;
        return result;
    }

    public static toEntity(input: AddressDto): Address {
        const result = new Address();
        result.id = input.id;
        ConverterUtil.updateObjRef(input, result, id => UserConverter.createIdObj(id), a => a.user, v => v.id, (w, u) => w.user = u);
        result.description = input.description;
        result.name = input.name;
        result.prename = input.prename;
        result.street = input.street;
        result.number = input.number;
        result.addition = input.addition;
        result.zipcode = input.zipcode;
        result.city = input.city;
        return result;
    }
}
