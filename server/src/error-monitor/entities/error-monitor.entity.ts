import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Breadcrumb } from "./breadcrumb.entity";

@Entity()
export class ErrorMonitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column("bigint")
  time: number;

  @Column({ default: "" })
  message: string;

  @Column({ default: "" })
  fileName: string;

  @Column({ default: 0 })
  line: number;

  @Column({ default: 0 })
  errorColumn: number;

  @Column({ default: "" })
  recordScreenId: string;

  @Column({ default: "" })
  userId: string;

  @Column({ default: "" })
  sdkVersion: string;

  @Column({ default: "" })
  apikey: string;

  @Column({ default: "" })
  uuid: string;

  @Column({ default: "" })
  pageUrl: string;

  @Column("json", { nullable: true })
  deviceInfo: {
    browserVersion: string;
    browser: string;
    osVersion: string;
    os: string;
    ua: string;
    device: string;
    device_type: string;
  };

  @OneToMany(() => Breadcrumb, (breadcrumb) => breadcrumb.errorMonitor, {
    cascade: true,
  })
  breadcrumb: Breadcrumb[];

  @CreateDateColumn({ type: "timestamp" })
  createTime: Date;
}
