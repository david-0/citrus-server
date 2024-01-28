
import * as dotenv from "dotenv";

dotenv.config();

class MyEnv {
    constructor(
        public readonly dbHost: string,
        public readonly dbDatabase: string,
        public readonly dbPort: number,
        public readonly dbUsername: string,
        public readonly dbPassword: string,
        public readonly prod: boolean,
        public readonly portHttps: number,
        public readonly portHttp: number,
        public readonly host: string,
        public readonly devSharedKey: string) {
    }

    public getPort(): number {
        return this.prod ? this.portHttps : this.portHttp;
    }

    public isHttps(): boolean {
        return this.prod;
    }

    public isDefaultPort(): boolean {
        if (this.isHttps()) {
            if (this.getPort() === 443) {
                return true;
            }
        } else {
            if (this.getPort() === 80) {
                return true;
            }
        }
        return false;
    }

    public getProtocol(): string {
        return this.isHttps() ? "https" : "http";
    }

    public getUrl(): string {
        return AppEnv.getProtocol() + "://" + AppEnv.host +
            (this.isDefaultPort() ? "" :
                ":" + AppEnv.getPort());
    }
}

export const AppEnv = new MyEnv(
    process.env.DB_HOST,
    process.env.DB_DATABASE,
    +process.env.DB_PORT,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    process.env.NODE_ENV !== "dev",
    +process.env.PORT_HTTPS,
    +process.env.PORT_HTTP,
    process.env.HOST,
    process.env.DEV_SHARED_KEY,
);
