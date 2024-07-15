import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { CustomHttpException } from "./exception";

interface ResponseData<T> {
  data: T;
  code: number;
  success: boolean;
  message: string;
}

@Injectable()
export class ResponseInterceptor<T = any> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ResponseData<T>> {
    return next.handle().pipe(
      map((data) => {
        let code = 200;
        let success = true;
        let message = "success";
        if (data?.code) {
          code = data.code;
          delete data.code;
        }
        if (data?.success) {
          success = data.success;
          delete data.success;
        }
        if (data?.message) {
          message = data.message;
          delete data.message;
        }
        return {
          data,
          code,
          success,
          message,
        };
      }),
      catchError((error) => {
        if (error instanceof CustomHttpException) {
          return throwError(
            () =>
              new BadRequestException({
                data: null,
                code: error.getCustomCode(),
                success: false,
                message: error.getCustomMessage(),
              })
          );
        } else if (error instanceof HttpException) {
          const status = error.getStatus();
          const response = error.getResponse();
          return throwError(
            () =>
              new HttpException(
                {
                  data: null,
                  code: status,
                  success: false,
                  message: response["message"] || error.message,
                },
                status
              )
          );
        } else {
          return throwError(
            () =>
              new InternalServerErrorException({
                data: null,
                code: 500,
                success: false,
                message: "Internal server error",
              })
          );
        }
      })
    );
  }
}
