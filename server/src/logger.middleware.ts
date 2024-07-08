import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { IncomingHttpHeaders } from "http";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, params, headers } = req;
    const userAgent = headers["user-agent"] || "Unknown";

    // Log request details
    this.logger.log(`Request: ${method} ${originalUrl}`);
    this.logger.log(`User-Agent: ${userAgent}`);
    this.logger.log(`Query Parameters: ${JSON.stringify(query)}`);
    this.logger.log(`Route Parameters: ${JSON.stringify(params)}`);

    // Check if the request contains files
    if (this.containsFiles(headers)) {
      this.logger.log(`Request Body contains files.`);
      // Optionally log partial content or some metadata
      this.logger.log(
        `Partial Request Body: ${JSON.stringify(this.getPartialBody(body))}`
      );
    } else {
      this.logger.log(
        `Request Body: ${JSON.stringify(this.getPartialBody(body))}`
      );
    }

    // Continue processing the request
    next();
  }

  private getPartialBody(body: any): any {
    const partialBody = { ...body };
    for (const key in partialBody) {
      if (partialBody.hasOwnProperty(key)) {
        const value = partialBody[key];
        if (typeof value === "string" && value.length > 100) {
          partialBody[key] = value.substring(0, 100) + "...";
        }
      }
    }
    return partialBody;
  }
  private containsFiles(headers: IncomingHttpHeaders): boolean {
    const contentType = headers["content-type"];
    return contentType ? contentType.includes("multipart/form-data") : false;
  }
}
