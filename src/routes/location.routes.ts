import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { LocationController } from "../controller/LocationController";

const Router = express.Router();

Router.get(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    LocationController.get
);
Router.get(
    "",
    authentification,
    authorization(["admin"]),
    LocationController.getAll
);
Router.put(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    LocationController.update
);
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    LocationController.save
);
Router.delete(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    LocationController.delete
);
Router.get(
    "/withOpeningHours/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    LocationController.getWithOpeningHours
);
Router.get(
    "/withOpeningHours",
    authentification,
    authorization(["admin"]),
    LocationController.getAllWithOpeningHours
);
Router.get(
    "/withOpeningHoursStocksAndArticle",
    authentification,
    authorization(["admin"]),
    LocationController.getAllWithOpeningHoursStocksAndArticle
);
Router.post(
    "/withOpeningHours",
    authentification,
    authorization(["admin"]),
    LocationController.save
);
Router.put(
    "/withOpeningHours/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    LocationController.update
);
Router.get(
    "/withAll",
    authentification,
    authorization(["admin"]),
    LocationController.getWithAll
);
Router.get(
    "/withAll/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    LocationController.getAllWithAll
);
export { Router as locationRouter };