import * as Promise from "bluebird";
import {UserInfoDto} from "citrus-common";
import {User} from "../models/User";
import {IProjector} from "./IProjector";

export class UserInfoDtoToUserProjector implements IProjector<UserInfoDto, User> {
  public project(dto: UserInfoDto): Promise<User> {
    return new Promise<User>((resolve) => {
      const user = new User();
      if (dto.id == null) {
        user.id = dto.id;
      }
      user.email = dto.email;
      user.mobile = dto.mobile;
      user.name = dto.name;
      user.number = dto.number;
      user.prename = dto.prename;
      // TODO add missing fields
      resolve(user);
    });
  }
}
