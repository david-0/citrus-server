import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { RoleController } from "../controller/RoleController";

const Router = express.Router();

Router.get(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    RoleController.get
);
Router.get(
    "",
    authentification,
    authorization(["admin"]),
    RoleController.getAll
);
Router.get(
    "/withUsers/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    RoleController.getWithUsers
);
Router.get(
    "/withUsers",
    authentification,
    authorization(["admin"]),
    RoleController.getAllWithUsers
);
Router.delete(
    "/withUsers/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    RoleController.delete
);
Router.put(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    RoleController.update
);
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    RoleController.save
);
Router.delete(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    RoleController.delete
);
export { Router as roleRouter };