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


export function getCurrentFormattedDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
