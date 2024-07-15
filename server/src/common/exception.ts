import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomHttpException extends HttpException {
  private readonly customCode: number;
  private readonly customMessage: string;

  constructor(customCode: number, customMessage: string) {
    super(customMessage, HttpStatus.OK); // 这里设置 HttpStatus.OK 是为了确保 HTTP 请求本身成功，但返回自定义的业务错误码
    this.customCode = customCode;
    this.customMessage = customMessage;
  }

  getCustomCode(): number {
    return this.customCode;
  }

  getCustomMessage(): string {
    return this.customMessage;
  }
}
