import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { payload } from "../dto/Token";
import { AppJwtConfiguration } from "./app-jwt-configuration";

export class encrypt {
    static async encryptpass(password: string) {
        return bcrypt.hashSync(password, 12);
    }
    static comparepassword(hashPassword: string, password: string) {
        if (!!hashPassword && hashPassword.length > 0) {
            return bcrypt.compareSync(password, hashPassword);
        }
        return false;
    }

    static generateToken(payload: payload) {
        return jwt.sign(payload, AppJwtConfiguration.signSecret,
            AppJwtConfiguration.signOptions);
    }
}