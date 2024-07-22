import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
} from "typeorm";
import { ErrorMonitor } from "./error-monitor.entity";

@Entity("device")
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: "",
    comment: "浏览器名称",
    length: 50,
    nullable: false,
  })
  browser: string; // 浏览器名称，例如 Chrome

  @Column({
    default: "",
    comment: "浏览器版本",
    length: 50,
    nullable: false,
  })
  browserVersion: string; // 浏览器版本，例如 126.0.0.0

  @Column({
    default: "",
    comment: "设备名称",
    length: 50,
    nullable: false,
  })
  device: string; // 设备名称，例如 Unknow

  @Column({
    name: "device_type",
    default: "",
    comment: "设备类型",
    length: 50,
    nullable: false,
  })
  device_type: string; // 设备类型，例如 Pc

  @Column({
    default: "",
    comment: "操作系统名称",
    length: 50,
    nullable: false,
  })
  os: string; // 操作系统名称，例如 Windows

  @Column({
    name: "os_version",
    default: "",
    comment: "操作系统版本",
    length: 50,
    nullable: false,
  })
  osVersion: string; // 操作系统版本，例如 10

  @Column({
    default: "",
    comment: "用户代理字符串",
    length: 255,
    nullable: false,
  })
  ua: string; // 用户代理字符串，例如 Mozilla/5.0 ...

  @Column({
    default: "",
    comment: "IP 地址",
    length: 45, // 足够存储 IPv6 地址
    nullable: false,
  })
  ip: string; // IP 地址，例如 120.122.2.34

  @CreateDateColumn({
    type: "timestamp",
    comment: "记录创建时间",
  })
  createTime: Date; // 记录创建时间

  // @OneToOne(() => ErrorMonitor, (errorMonitor) => errorMonitor.deviceData)
  // errorMonitor: ErrorMonitor;
}
