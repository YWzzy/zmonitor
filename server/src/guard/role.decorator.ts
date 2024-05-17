import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  applyDecorators,
} from "@nestjs/common";

export const Role = (...args: string[]) => SetMetadata("role", args);

export const ReqUrl = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    console.log(data);

    // return applyDecorators(Role);
    return req.url;
  }
);
