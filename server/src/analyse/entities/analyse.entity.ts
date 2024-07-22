import { ErrorMonitor } from "src/error-monitor/entities/error-monitor.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";

@Entity("analyse")
export class Analyse {
  @PrimaryGeneratedColumn({ comment: "主键ID" })
  id: number;

  @Column({
    type: "varchar",
    length: 255,
    default: "",
    comment: "应用ID",
  })
  appId: string;

  @Column({
    type: "varchar",
    length: 255,
    default: "",
    comment: "类型",
  })
  type: string;

  @Column({
    type: "int",
    default: 0,
    comment: "每日活跃用户数",
  })
  activeUsers: number;

  @Column({
    type: "int",
    default: 0,
    comment: "每日新增用户数",
  })
  newUsers: number;

  @Column({
    type: "int",
    default: 0,
    comment: "每日页面访问量",
  })
  pv: number;

  @Column({
    type: "date",
    comment: "日期",
  })
  date: string;

  @CreateDateColumn({
    type: "timestamp",
    comment: "创建时间",
  })
  createTime: Date;

  @UpdateDateColumn({
    type: "timestamp",
    comment: "更新时间",
  })
  updateTime: Date;

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

  @OneToOne(() => ErrorMonitor, (errorMonitor) => errorMonitor.analyseData)
  errorMonitor: ErrorMonitor;
}
