import {MailService} from "./MailService";

export class StartupNotifier {
  public notify(email: string, env: string) {
    const mailer = new MailService("../configuration/smtp.json");
    mailer.sendMail(email, "node restart (" + env + ")", "Node-Server(" + env + ") wurde neu gestartet.", null);
  }
}
