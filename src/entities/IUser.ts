import {IRole} from './IRole';
import {IId} from './IId';

export interface IUser extends IId {
    email: string;
    password: string;
    roles: IRole[];
}
