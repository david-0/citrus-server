// import "reflect-metadata";
import {Service} from "typedi";

@Service()
export class UrlService {

  private env: string;
  private protocol: string;
  private host: string;
  private port: number;

  public setState(env: string, protocol: string, host: string, port: number) {
    this.env = env;
    this.port = port;
    this.protocol = protocol;
    this.host = host;
  }

  public createUrl(): string {
    if (this.env === "production") {
      if (this.port === 80 || this.port === 443) {
        return this.protocol + "://shop.el-refugio-denia.com";
      } else {
        return this.protocol + "://shop.el-refugio-denia.com:" + this.port;
      }
    } else {
      return this.protocol + "://" + this.host + ":" + this.port;
    }
  }
}
