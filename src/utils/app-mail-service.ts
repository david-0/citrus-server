import "reflect-metadata";
import { MailService } from "./MailService";

export const AppMailService = new MailService("../../configuration/smtp.json");
