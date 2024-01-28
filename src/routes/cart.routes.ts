import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { CartController } from "../controller/CartController";

const Router = express.Router();
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    CartController.save
);
export { Router as cartRouter };