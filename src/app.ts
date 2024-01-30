import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import { configure, getLogger, Logger } from "log4js";
import * as path from "path";
import "reflect-metadata";
import { ResetTokenEvictor } from "./utils/ResetTokenEvictor";
import { StartupNotifier } from "./utils/StartupNotifier";
import { orderRouter } from "./routes/person.routes";
import { articleRouter } from "./routes/article.routes";
import { unitOfMeasurementRouter } from "./routes/unitOfMeasurement.routes";
import { roleRouter } from "./routes/role.routes";
import { userRouter } from "./routes/user.routes";
import { articleStockRouter } from "./routes/articleStock.routes";
import { orderitemRouter } from "./routes/orderItem.routes";
import { openinghourRouter } from "./routes/openingHour.routes";
import { confirmationRouter } from "./routes/confirmation.routes";
import { messageRouter } from "./routes/message.routes";
import { cartRouter } from "./routes/cart.routes";
import { messageTemplateRouter } from "./routes/messageTemplate.routes";
import { deliveryNoteRouter } from "./routes/deliveryNote.routes";
import { locationRouter } from "./routes/location.routes";
import { imageRouter } from "./routes/image.routes";
import { orderarchiveRouter } from "./routes/orderArchive.routes";
import { securityRouter } from "./routes/security.routes";
import { AppEnv } from "./utils/app-env";
import { errorHandler } from "./middleware/error.middleware";
import { AppDataSource } from "./utils/app-data-source";

const LOGGER: Logger = getLogger("Server");

class Server {

  public static bootstrap(): Server {
    return new Server();
  }

  public app: express.Application;
  private server: any;

  constructor() {
    configure({
      appenders: { out: { type: "stdout" } },
      categories: { default: { appenders: ["out"], level: "info" } },
    });
    this.logServerType();
    this.app = express();
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(errorHandler);
    AppDataSource.initialize()
      .then(async () => {
        new ResetTokenEvictor().schedule(0);
        this.routes();
        this.staticRoutes();
        this.defaultRoute();
        this.createServer();
        this.app.get("*", (req: express.Request, res: express.Response) => {
          res.status(505).json({ message: "Bad Request" });
        });

        // Start listening
        this.listen();
        new StartupNotifier().notify("david.leuenberger@gmx.ch", AppEnv.getUrl());
      }).catch(err => {
        LOGGER.error("Create Connection error: {}", err);
      });
  }

  private corsOptions(): cors.CorsOptions {
    let corsOptions: cors.CorsOptions = {};
    if (AppEnv.prod) {
      corsOptions = {
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        methods: "POST, GET, PATCH, DELETE, PUT",
        origin: "*",
        preflightContinue: false,
      };
    }
    return corsOptions;
  }

  private createServer() {
    if (AppEnv.prod) {
      this.redirectHttp();
      this.server = this.createHttpsServer();
    } else {
      this.server = this.createHttpServer();
    }
  }

  private createHttpsServer() {
    LOGGER.info("Start HTTPS server");
    return https.createServer({
      ca: fs.readFileSync("../../certificate/ssl/chain.pem"),
      cert: fs.readFileSync("../../certificate/ssl/cert.pem"),
      key: fs.readFileSync("../../certificate/ssl/privkey.pem"),
    }, this.app);
  }

  private createHttpServer() {
    LOGGER.info("Start HTTP server");
    return http.createServer(this.app);
  }

  private redirectHttp() {
    LOGGER.info(`Redirect from ` + AppEnv.portHttp + ` to ` + AppEnv.portHttps + `.`);
    // set up plain http server
    const httpApp = express();
    const httpServer = http.createServer(httpApp);
    httpApp.use("*", this.redirectToHttps);
    httpServer.listen(AppEnv.portHttp);
  }

  private redirectToHttps(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.redirect(AppEnv.getUrl() + req.url);
//    res.redirect("https://shop.el-refugio-denia.com" + req.url);
  }

  private logServerType(): void {
    if (AppEnv.prod) {
      LOGGER.info(`PRODUCTION-MODE, use private/public keys.`);
    } else {
      LOGGER.info(`DEVELOPMENT-MODE, use shared secret.`);
    }
  }

  private staticRoutes(): void {
    const staticRoutePath =  path.join(__dirname, "client");
    if (fs.existsSync(staticRoutePath)) {
      LOGGER.info(`Static-Route: serve files from "/client" in "/"`);
      this.app.use(express.static(staticRoutePath));
    }
  }

  private defaultRoute(): void {
    this.app.get("*", function (req, res) {
      res.sendFile(path.join(__dirname, "client", "index.html"));
    });
  }

  private routes(): void {
    this.app.use(cors(this.corsOptions()));
    this.app.use("/api/article", articleRouter);
    this.app.use("/api/articleStock", articleStockRouter);
    this.app.use("/api/cart", cartRouter);
    this.app.use("/api/confimation", confirmationRouter);
    this.app.use("/api/deliveryNote", deliveryNoteRouter);
    this.app.use("/api/image", imageRouter);
    this.app.use("/api/location", locationRouter);
    this.app.use("/api/message", messageRouter);
    this.app.use("/api/messageTemplate", messageTemplateRouter);
    this.app.use("/api/openingHour", openinghourRouter);
    this.app.use("/api/orderArchive", orderarchiveRouter);
    this.app.use("/api/order", orderRouter);
    this.app.use("/api/orderItem", orderitemRouter);
    this.app.use("/api/role", roleRouter);
    this.app.use("/api/authenticate", securityRouter);
    this.app.use("/api/unitOfMeasurement", unitOfMeasurementRouter);
    this.app.use("/api/user", userRouter);
  }

    // Start HTTP server listening
    private listen(): void {
      this.server.listen(AppEnv.getPort());
  
      // // add error handler
      this.server.on("error", this.logError);
  
      // start listening on port
      this.server.on("listening", () => {
        LOGGER.info("Citrus server running at " + AppEnv.getUrl());
      });
    }

  private logError(error: Error) {
    LOGGER.error(`ERROR: ${error.stack}`);
  }
}

// Bootstrap the server
export = Server.bootstrap().app;
