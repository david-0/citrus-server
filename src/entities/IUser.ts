import {IRole} from "./IRole";

export interface IUser {
    email: string;
    password: string;
    roles: IRole[];
}
