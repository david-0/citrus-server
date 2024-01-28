import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { UserController } from "../controller/UserController";
import { SecurityController } from "../controller/SecurityController";

const Router = express.Router();

Router.get(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    UserController.get
);
Router.get(
    "",
    authentification,
    authorization(["admin"]),
    UserController.getAll
);
Router.get(
    "/withRoles/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    UserController.getWithRoles
);
Router.get(
    "/withRoles",
    authentification,
    authorization(["admin"]),
    UserController.getAllWithRoles
);
Router.put(
    "/withRoles/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    UserController.update
);
Router.post(
    "/withRoles",
    authentification,
    authorization(["admin"]),
    UserController.save
);
Router.get(
    "/withAll/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    UserController.getWithAll
);
Router.get(
    "/withAll",
    authentification,
    authorization(["admin"]),
    UserController.getAllWithAll
);
Router.delete(
    "/withAll/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    UserController.deleteWithAll
);
Router.put(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    UserController.update
);
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    UserController.save
);
Router.delete(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    UserController.delete
);

Router.post(
    "/api/user/:id([0-9]+)/changepassword",
    authentification,
    authorization(["admin"]),
    SecurityController.addChangePasswordEndpoint
);
Router.post(
    "/api/user/changemypassword",
    authentification,
    authorization,
    SecurityController.addChangeMyPasswordEndpoint
);
Router.post(
    "/api/user/resetPasswordWithToken",
    SecurityController.resetPasswordWithTokenEndpoint
);
Router.post(
    "/api/user/createTokenByEmail",
    SecurityController.createTokenByEmailEndpoint
);
Router.post(
    "/api/user/register",
    SecurityController.register
);
Router.post(
    "/api/user/confirm",
    SecurityController.userConfirmation
);

export { Router as userRouter };