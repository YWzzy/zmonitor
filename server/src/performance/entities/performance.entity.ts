import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Resource } from "./resource.entity";
import { LongTask } from "./long_task.entity";

@Entity("performance_monitor")
export class Performance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, comment: "性能监控的类型" })
  type: string;

  @Column({ type: "varchar", length: 255, comment: "性能监控的状态" })
  status: string;

  @Column({ type: "bigint", comment: "时间戳" })
  time: number;

  @Column({ type: "varchar", length: 255, default: "", comment: "名称" })
  name: string;

  @Column({ type: "varchar", length: 255, default: "", comment: "用户ID" })
  userId: string;

  @Column({ type: "varchar", length: 255, default: "", comment: "SDK版本" })
  sdkVersion: string;

  @Column({ type: "varchar", length: 255, default: "", comment: "API密钥" })
  appId: string;

  @Column({ type: "varchar", length: 255, default: "", comment: "唯一标识符" })
  uuid: string;

  @Column({ type: "varchar", length: 255, default: "", comment: "页面URL" })
  pageUrl: string;

  @Column({ type: "json", nullable: true, comment: "设备信息" })
  deviceInfo: Record<string, any>;

  @OneToMany(() => Resource, (resource) => resource.performance, {
    cascade: true, // 保存时级联保存
  })
  resourceList: Resource[];

  @OneToOne(() => LongTask, (longTask) => longTask.performance, {
    cascade: true,
  })
  @JoinColumn()
  longTask: LongTask;

  @Column({ type: "double", nullable: true, comment: "性能值" })
  performanceValue: number;

  @CreateDateColumn({ type: "timestamp", comment: "记录创建时间" })
  createTime: Date;
}
