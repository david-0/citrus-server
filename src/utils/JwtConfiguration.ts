import * as fs from "fs";
import {SignOptions} from "jsonwebtoken";
import {Logger} from "log4js";
import log4js = require("log4js");
import { AppEnv } from "./app-env";

const LOGGER: Logger = log4js.getLogger("JwtConfiguration");

export class JwtConfiguration {

  constructor(public readonly signSecret: string | Buffer, public readonly verifySecret: string | Buffer, public readonly signOptions: SignOptions) {
  }

  static initDev(): JwtConfiguration {
    return new JwtConfiguration(AppEnv.devSharedKey, AppEnv.devSharedKey, { expiresIn: "1h" });
  }

  static initProd(privateKeyFilename: string, publicKeyFilename: string): JwtConfiguration {
    if (!fs.existsSync(privateKeyFilename) || !fs.existsSync(publicKeyFilename)) {
      LOGGER.fatal(`in PRODUCTION-MODE, the private (${privateKeyFilename}) and public
       (${publicKeyFilename}) key files must exist.`);
      process.exit(0);
    }
    return new JwtConfiguration(fs.readFileSync(privateKeyFilename), fs.readFileSync(publicKeyFilename), { expiresIn: "1h", algorithm: "RS512" });
  }
}
