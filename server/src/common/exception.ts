import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomHttpException extends HttpException {
  private readonly customCode: number;
  private readonly customMessage: string;

  constructor(
    customCode: number,
    customMessage: string,
    status: number = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    super(customMessage, status);
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
