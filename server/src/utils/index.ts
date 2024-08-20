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

/**
 * 校验 URL 是否有效
 * @param url - 要校验的 URL 字符串
 * @returns 如果 URL 合法，返回 true；否则返回 false
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url); // 尝试使用 URL 构造函数解析 URL
    return true;
  } catch {
    return false;
  }
}

export function timestampToDateString(timestamp: number | string): string {
  const date = new Date(Number(timestamp) * 1000); // 时间戳是秒，所以需要乘以1000转换为毫秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}