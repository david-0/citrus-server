import * as express from "express";
import {ExpressMiddlewareInterface, Middleware} from "routing-controllers";

/**
 * Does not call next() if route already processed before.
 */
@Middleware({type: "after"})
export class SuppressNextMiddlewareHandler implements ExpressMiddlewareInterface {

  public use(request: express.Request, response: express.Response, next: (err?: any) => any): any {
    if (!response.headersSent) {
      next();
    }
  }
}
