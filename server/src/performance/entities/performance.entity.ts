import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Resource } from "./resource.entity";
import { LongTask } from "./long_task.entity";

@Entity("performance_monitor")
export class Performance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: "性能监控的类型" })
  type: string;

  @Column({ comment: "性能监控的状态" })
  status: string;

  @Column("bigint", { comment: "时间戳" })
  time: number;

  @Column({ default: "", comment: "名称" })
  name: string;

  @Column({ default: "", comment: "用户ID" })
  userId: string;

  @Column({ default: "", comment: "SDK版本" })
  sdkVersion: string;

  @Column({ default: "", comment: "API密钥" })
  apikey: string;

  @Column({ default: "", comment: "唯一标识符" })
  uuid: string;

  @Column({ default: "", comment: "页面URL" })
  pageUrl: string;

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

  @OneToMany(() => Resource, (resource) => resource.performance, {
    cascade: true, // 保存时级联保存
  })
  resourceList: Resource[];

  @OneToOne(() => LongTask, (longTask) => longTask.performance, {
    cascade: true,
  })
  @JoinColumn()
  longTask: LongTask;

  @CreateDateColumn({ type: "timestamp", comment: "记录创建时间" })
  createTime: Date;
}
