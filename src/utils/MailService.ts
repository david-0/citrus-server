import * as fs from "fs";
import {getLogger, Logger} from "log4js";
import * as nodemailer from "nodemailer";
import {SentMessageInfo} from "nodemailer";

export class MailService {
  private LOGGER: Logger = getLogger("Server");

  private host: string;
  private port: number;
  private user: string;
  private password: string;
  private from: string;
  private initialized: boolean;

  constructor(configFile: string) {
    if (fs.existsSync(configFile)) {
      const buffer = fs.readFileSync(configFile);
      const config = JSON.parse(buffer.toString());
      this.host = config.host;
      this.port = +config.port;
      this.user = config.user;
      this.password = config.password;
      this.from = config.from;
      this.initialized = true;
      this.LOGGER.info("Mailservice initialized");
    } else {
      this.LOGGER.warn("Mailservice not initialized: no configfile found.");
    }
  }

  public async sendMail(to: string, subject: string, text: string, html: string): Promise<SentMessageInfo | undefined> {
    if (this.initialized) {
      const transporter = nodemailer.createTransport({
        auth: {
          pass: this.password,
          user: this.user,
        },
        host: this.host,
        port: this.port,
      });
      return await transporter.sendMail({
        from: this.from,
        html,
        subject,
        text,
        to,
      });
    }
    return undefined;
  }

}
