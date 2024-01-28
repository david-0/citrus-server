import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { ArticleStockController } from "../controller/ArticleStockController";

const Router = express.Router();

Router.get(
    "/:id([0-9]+)",
    ArticleStockController.get
);
Router.get(
    "",
    ArticleStockController.getAll
);
Router.get(
    "/withArticle/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    ArticleStockController.getWithArticle
);
Router.get(
    "/withArticle",
    authentification,
    authorization(["admin"]),
    ArticleStockController.getAllWithArticle
);
Router.get(
    "/withAll/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    ArticleStockController.getWithAll
);
Router.get(
    "/withAll",
    authentification,
    authorization(["admin"]),
    ArticleStockController.getAllWithAll
);
Router.put(
    "/withAll/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    ArticleStockController.update
);
Router.post(
    "/withAll",
    authentification,
    authorization(["admin"]),
    ArticleStockController.save
);
Router.post(
    "",
    authentification,
    authorization(["admin"]),
    ArticleStockController.save
);
Router.delete(
    "/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    ArticleStockController.delete
);
Router.delete(
    "/withAll/:id([0-9]+)",
    authentification,
    authorization(["admin"]),
    ArticleStockController.delete
);
export { Router as articleStockRouter };