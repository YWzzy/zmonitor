import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { CustomHttpException } from "./exception";

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let customCode = status;
    let customMessage = exception.message;

    if (exception instanceof CustomHttpException) {
      customCode = exception.getCustomCode();
      customMessage = exception.getCustomMessage();
    }

    response.status(status).json({
      code: customCode,
      message: customMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
