import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { IncomingHttpHeaders } from "http";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, params, headers } = req;
    const userAgent = headers["user-agent"] || "Unknown";
    const startTime = Date.now();

    // Log request details
    this.logger.log(`Request: ${method} ${originalUrl}`);
    this.logger.log(`User-Agent: ${userAgent}`);
    this.logger.log(`Query Parameters: ${JSON.stringify(query)}`);
    this.logger.log(`Route Parameters: ${JSON.stringify(params)}`);

    if (this.containsFiles(headers)) {
      this.logger.log(`Request Body contains files.`);
      this.logger.log(`Partial Request Body: ${JSON.stringify(this.getPartialBody(body))}`);
    } else {
      this.logger.log(`Request Body: ${JSON.stringify(this.getPartialBody(body))}`);
    }

    // Log the response after it is finished
    res.on("finish", () => {
      const responseTime = Date.now() - startTime;
      this.logger.log(`Response: ${res.statusCode} ${method} ${originalUrl} - ${responseTime}ms`);
    });

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
