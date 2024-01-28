import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { OrderItemController } from "../controller/OrderItemController";

const Router = express.Router();

Router.get(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderItemController.get
);
Router.get(
    "",
    authentification,
    authorization(["admin"]),
    OrderItemController.getAll
);
Router.put(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderItemController.update
);
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    OrderItemController.save
);
Router.delete(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderItemController.delete
);
export { Router as orderitemRouter };