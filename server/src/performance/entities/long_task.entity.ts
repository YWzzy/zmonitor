import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { Performance } from "./performance.entity";

@Entity("long_task_performance")
export class LongTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  entryType: string;

  @Column("float")
  startTime: number;

  @Column("float")
  duration: number;

  @Column("simple-json", { nullable: true })
  attribution: any[];

  @CreateDateColumn({ type: "timestamp" })
  createTime: Date;

  @OneToOne(() => Performance, (performance) => performance.longTask)
  performance: Performance;
}
