import {Sequelize} from "sequelize-typescript";
import {getLogger, Logger} from "../utils/logger";

const LOGGER: Logger = getLogger("DBService");

export class DBService {

  public static init(): DBService {

    this.db = new Sequelize({
      dialect: "postgres",
      modelPaths: [__dirname + "/../models"],
      name: "citrus",
      password: "citrus",
      username: "citrus",
    });

    this.db
      .authenticate()
      .then(() => {
        LOGGER.info("Connection has been established successfully.");
      })
      .catch((err) => {
        LOGGER.error("Unable to connect to the database:", err);
      });
    this.db.sync()
      .then(() => {
        LOGGER.info("Model sync successfully.");
      })
      .catch((err) => {
        LOGGER.error("Model sync failed:", err);
      });

    return DBService.instance;
  }

  public get service(): DBService {
    return DBService.instance;
  }

  private static instance: DBService = new DBService();
  private static db: Sequelize;

  private constructor() {
  }
}
