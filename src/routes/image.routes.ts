import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { ImageController } from "../controller/ImageController";

const Router = express.Router();

Router.get(
    "/:id([0-9]+)",
    ImageController.get
);
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    ImageController.save
);
export { Router as imageRouter };