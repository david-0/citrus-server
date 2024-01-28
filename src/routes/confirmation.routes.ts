import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { ConfirmationController } from "../controller/ConfirmationController";

const Router = express.Router();
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    ConfirmationController.resendOrderConfirmation
);
export { Router as confirmationRouter };