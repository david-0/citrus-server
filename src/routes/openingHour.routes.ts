import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { OpeningHourController } from "../controller/OpeningHourController";

const Router = express.Router();

Router.get(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OpeningHourController.get
);
Router.get(
    "",
    authentification,
    authorization(["admin"]),
    OpeningHourController.getAll
);
Router.put(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OpeningHourController.update
);
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    OpeningHourController.save
);
Router.delete(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    OpeningHourController.delete
);
export { Router as openinghourRouter };