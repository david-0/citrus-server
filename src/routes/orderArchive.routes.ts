import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { OrderArchiveController } from "../controller/OrderArchiveController";

const Router = express.Router();

Router.get(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderArchiveController.get
);
Router.get(
    "",
    authentification,
    authorization(["admin"]),
    OrderArchiveController.getAll
);
Router.get(
    "/archiving/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderArchiveController.archiveOrder
);
Router.get(
    "/myOrders",
    authentification,
    authorization,
    OrderArchiveController.myOrders
);
Router.get(
    "/byUser/:userId([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderArchiveController.byUser
);
Router.delete(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OrderArchiveController.delete
);
export { Router as orderarchiveRouter };