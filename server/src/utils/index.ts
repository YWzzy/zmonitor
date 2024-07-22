import { Request } from "express";

export const getIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];
  let ip: string | undefined;

  if (typeof forwarded === "string") {
    ip = forwarded.split(",").find((address) => address.includes("."));
  }

  if (!ip) {
    const remoteAddress = req.socket.remoteAddress;
    if (remoteAddress && remoteAddress.includes(".")) {
      ip = remoteAddress;
    } else if (remoteAddress && remoteAddress.includes(":")) {
      ip = remoteAddress;
    }
  }

  return ip || "";
};
