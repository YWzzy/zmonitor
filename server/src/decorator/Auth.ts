import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../common/auth";

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard));
}
