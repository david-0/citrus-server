import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { UnitOfMeasurementController } from "../controller/UnitOfMeasurementController";

const Router = express.Router();

Router.get(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    UnitOfMeasurementController.get
);
Router.get(
    "",
    authentification,
    authorization(["admin"]),
    UnitOfMeasurementController.getAll
);
Router.get(
    "/withArticles/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    UnitOfMeasurementController.getWithArticles
);
Router.get(
    "/withArticles",
    authentification,
    authorization(["admin"]),
    UnitOfMeasurementController.getAllWithArticles
);
Router.delete(
    "/withArticles/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    UnitOfMeasurementController.delete
);
Router.put(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    UnitOfMeasurementController.update
);
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    UnitOfMeasurementController.save
);
Router.delete(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    UnitOfMeasurementController.delete
);
export { Router as unitOfMeasurementRouter };