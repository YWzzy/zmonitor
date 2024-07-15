import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomException extends HttpException {
  private readonly errorCode: number;
  constructor(errorCode: number, message: string) {
    super(message, HttpStatus.BAD_REQUEST);
    this.errorCode = errorCode;
  }

  getErrorCode(): number {
    return this.errorCode;
  }
}
