import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { DeliveryNoteController } from "../controller/DeliveryNoteController";

const Router = express.Router();
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    DeliveryNoteController.returnDeliveryNote
);
export { Router as deliveryNoteRouter };