import { Injectable, NestMiddleware, Logger } from "@nestjs/common";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: any, res: any, next: () => void) {
    const { method, originalUrl, body, query, params } = req;
    const userAgent = req.headers["user-agent"] || "Unknown";

    // Log request details
    this.logger.log(`Request: ${method} ${originalUrl}`);
    this.logger.log(`User-Agent: ${userAgent}`);
    this.logger.log(`Request Body: ${JSON.stringify(body)}`);
    this.logger.log(`Query Parameters: ${JSON.stringify(query)}`);
    this.logger.log(`Route Parameters: ${JSON.stringify(params)}`);

    // Continue processing the request
    next();
  }
}
