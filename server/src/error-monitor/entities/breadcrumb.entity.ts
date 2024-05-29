import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { ErrorMonitor } from "./error-monitor.entity";

@Entity("breadcrumb_error")
export class Breadcrumb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  category: string;

  @Column({ name: "dataContent", type: "text" })
  data: string;

  @Column()
  status: string;

  @Column("bigint")
  time: number;

  @CreateDateColumn({ type: "timestamp" })
  createTime: Date;

  @ManyToOne(() => ErrorMonitor, (errorMonitor) => errorMonitor.breadcrumb)
  errorMonitor: ErrorMonitor;
}
