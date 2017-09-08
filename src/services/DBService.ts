import {Sequelize} from "sequelize-typescript";
import {getLogger, Logger} from "../utils/logger";

const LOGGER: Logger = getLogger("DBService");

/**
 * This singleton class manages the connection to the database and keeps it up and running.
 */
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
    return DBService.instance;
  }

  private static instance: DBService = new DBService();
  private static db: Sequelize;
}
