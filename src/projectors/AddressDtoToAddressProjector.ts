import * as Promise from "bluebird";
import {AddressDto} from "citrus-common";
import {Address} from "../models/Address";
import {IProjector} from "./IProjector";

export class AddressDtoToAddressProjector implements IProjector<AddressDto, Address> {
  public project(dto: AddressDto): Promise<Address> {
    return new Promise<Address>((resolve) => {
      const address = new Address();
      if (dto.id == null) {
        address.id = dto.id;
      }
      address.name = dto.name;
      address.prename = dto.prename;
      address.addition = dto.addition;
      address.description = dto.description;
      address.city = dto.city;
      address.zipcode = dto.zipcode;
      address.street = dto.street;
      address.userId = dto.userId;
      resolve(address);
    });
  }
}
