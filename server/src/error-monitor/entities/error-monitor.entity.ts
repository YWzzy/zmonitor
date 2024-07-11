import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Breadcrumb } from "./breadcrumb.entity";

@Entity("error_monitor")
export class ErrorMonitor {
  @PrimaryGeneratedColumn({ comment: "主键ID" })
  id: number;

  @Column({ comment: "错误类型" })
  type: string;

  @Column({ comment: "错误状态" })
  status: string;

  @Column("bigint", { comment: "时间戳" })
  time: number;

  @Column({ default: "", comment: "错误信息" })
  message: string;

  @Column({ default: "", comment: "文件名" })
  fileName: string;

  @Column({ default: 0, comment: "行号" })
  line: number;

  @Column({
    default: -1,
    type: "int",
    name: "errorColumn",
    comment: "错误列号",
  })
  column: number;

  @Column({ default: "", comment: "录屏ID" })
  recordScreenId: string;

  @Column({ default: "", comment: "用户ID" })
  userId: string;

  @Column({ default: "", comment: "SDK版本" })
  sdkVersion: string;

  @Column({ default: "", comment: "API密钥" })
  appId: string;

  @Column({ default: "", comment: "唯一标识符" })
  uuid: string;

  @Column({ default: "", comment: "页面URL" })
  pageUrl: string;

  @Column({ default: "", comment: "请求URL" })
  url: string;

  @Column("json", { nullable: true, comment: "请求数据" })
  requestData: {
    query: string;
    body: string;
    params: string;
    headers: string;
    httpType: string;
    method: string;
    data: any;
  };

  @Column("json", { nullable: true, comment: "请求响应数据" })
  response: {
    Status: number;
    statusText: string;
    headers: string;
    data: any;
  };

  @Column({ default: 0, comment: "请求消耗时长" })
  elapsedTime: number;

  @Column("json", { nullable: true, comment: "设备信息" })
  deviceInfo: {
    browserVersion: string;
    browser: string;
    osVersion: string;
    os: string;
    ua: string;
    device: string;
    device_type: string;
  };

  @Column({ default: false, comment: "是否隐藏" })
  isDeleted: boolean;

  @OneToMany(() => Breadcrumb, (breadcrumb) => breadcrumb.errorMonitor, {
    cascade: true,
  })
  breadcrumb: Breadcrumb[];

  @CreateDateColumn({ type: "timestamp", comment: "记录创建时间" })
  createTime: Date;
}
