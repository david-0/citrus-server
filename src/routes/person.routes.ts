import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { OrderController } from "../controller/OrderController";

const Router = express.Router();

Router.get(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderController.get
);
Router.get(
    "",
    authentification,
    authorization(["admin"]),
    OrderController.getAll
);
Router.put(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderController.update
);
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    OrderController.save
);
Router.delete(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderController.delete
);
Router.get(
    "/withAll/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderController.getWithAll
);
Router.get(
    "/withAll",
    authentification,
    authorization(["admin"]),
    OrderController.getAllWithAll
);
Router.get(
    "/withAll/myOrders",
    authentification,
    authorization(["admin"]),
    OrderController.getMyOrders
);
Router.get(
    "/withAll/byUser/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderController.getByUser
);
Router.put(
    "/withAll/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderController.update
);
Router.post(
    "/withAll",
    authentification,
    authorization(["admin"]),
    OrderController.save
);
Router.delete(
    "/withAll/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderController.deleteWithAll
);
export { Router as orderRouter };