import { Injectable, NestInterceptor, CallHandler } from "@nestjs/common";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

interface data<T> {
  data: T;
}

@Injectable()
export class ResponseInter<T = any> implements NestInterceptor {
  intercept(context, next: CallHandler): Observable<data<T>> {
    return next.handle().pipe(
      map((data) => {
        let code = 200;
        let success = true;
        let message = "success";
        if (data?.code) {
          code = data.code;
        }
        if (data?.success) {
          success = data.success;
        }
        if (data?.message) {
          message = data.message;
        }
        return {
          data,
          code,
          success,
          message,
        };
      })
    );
  }
}
