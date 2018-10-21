import {ValidationError} from "class-validator";
import * as express from "express";
import {getLogger, Logger} from "log4js";
import {ExpressErrorMiddlewareInterface, HttpError, Middleware} from "routing-controllers";

/**
 * Express middleware to catch all errors throwed in controlers.
 * Should be first in error chain as it sends response to client.
 *
 * https://github.com/typestack/routing-controllers/issues/87
 *
 * @export
 * @class CustomErrorHandler
 * @implements {ErrorMiddlewareInterface}
 */
@Middleware({type: "after"})
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {

  private LOGGER: Logger = getLogger("CustomErrorHandler");

  /**
   * Error handler - sets response code and sends json with error message.
   * Handle: standard node error, HttpError, ValidationError and string.
   *
   * @param {any} error An throwed object (error)
   * @param {express.Request} req The Express request object
   * @param {express.Response} response The Express response object
   * @param {express.NextFunction} next The next Express middleware function
   */
  public error(error: any, request: express.Request, response: express.Response, next: express.NextFunction) {
    const responseObject = {} as any;

    // if its an array of ValidationError
    if (Array.isArray(error) && error.every(element => element instanceof ValidationError)) {
      response.status(400);
      responseObject.message = "You have an error in your request's body. Check 'errors' field for more details!";
      responseObject.errors = error;
      // responseObject.details = [];
      // error.forEach((element: ValidationError) => {
      //     Object.keys(element.constraints).forEach((type) => {
      //         responseObject.details.push(`property ${element.constraints[type]}`);
      //     });
      // });
    } else {
      // set http status
      if (error instanceof HttpError && error.httpCode) {
        response.status(error.httpCode);
      } else {
        this.LOGGER.error(error.stack);
        response.status(500);
      }

      if (error instanceof Error) {
        const developmentMode: boolean = process.env.NODE_ENV === "development";

        // set response error fields
        if (error.name && (developmentMode || error.message)) { // show name only if in development mode and if error message exist too
          responseObject.name = error.name;
        }
        if (error.message) {
          responseObject.message = error.message;
        }
        if (error.stack && developmentMode) {
          responseObject.stack = error.stack;
        }
      } else if (typeof error === "string") {
        responseObject.message = error;
      }
    }

    // send json only with error
    response.json(responseObject);
  }
}
