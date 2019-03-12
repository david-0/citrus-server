import {MailService} from "./MailService";

export class StartupNotifier {
  public notify(email: string) {
    const mailer  = new MailService("../../configuration/smtp.json");
    mailer.sendMail(email, "node restart", "Node-Server wurde neu gestartet.", null);
  }
}
