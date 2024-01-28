import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { MessageController } from "../controller/MessageController";

const Router = express.Router();
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    MessageController.update
);
export { Router as messageRouter };