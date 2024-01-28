import "reflect-metadata";
import { JwtConfiguration } from "./JwtConfiguration";
import { AppEnv } from "./app-env";

export const AppJwtConfiguration =
    AppEnv.prod
        ? JwtConfiguration.initProd("../../certificate/jwt/private-key.pem", "../../certificate/jwt/public-key.pem")
        : JwtConfiguration.initDev();
