import "reflect-metadata";
import { DataSource } from "typeorm";

import { ResetToken } from "../entity/ResetToken";
import { Role } from "../entity/Role";
import { User } from "../entity/User";
import { UserAudit } from "../entity/UserAudit";
import { AppEnv } from "./app-env";
import { Article } from "../entity/Article";
import { ArticleStock } from "../entity/ArticleStock";
import { Message } from "../entity/Message";
import { MessageTemplate } from "../entity/MessageTemplate";
import { OpeningHour } from "../entity/OpeningHour";
import { Order } from "../entity/Order";
import { OrderArchive } from "../entity/OrderArchive";
import { OrderItem } from "../entity/OrderItem";
import { UnitOfMeasurement } from "../entity/UnitOfMeasurement";
import { UserNotConfirmed } from "../entity/UserNotConfirmed";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: AppEnv.dbHost,
    port: AppEnv.dbPort,
    username: AppEnv.dbUsername,
    password: AppEnv.dbPassword,
    database: AppEnv.dbDatabase,

    synchronize: AppEnv.prod ? false : false,
    //logging logs sql command on the treminal
    logging: AppEnv.prod ? false : false,
    migrationsRun: true,
    entities: [Article, ArticleStock, Image, Location, Message, MessageTemplate, OpeningHour, Order, OrderArchive, OrderItem, ResetToken, Role, UnitOfMeasurement, User, UserAudit, UserNotConfirmed],
    migrations: [__dirname + "/../migration/*.ts"],
    subscribers: [__dirname + "/../subscriber/*.ts"],
});
