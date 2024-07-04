import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("analyse")
export class Analyse {
  @PrimaryGeneratedColumn({ comment: "主键ID" })
  id: number;

  @Column({
    type: "varchar",
    length: 255,
    comment: "应用ID",
  })
  appId: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "类型",
  })
  type: string;

  @Column({
    type: "int",
    comment: "每日活跃用户数",
  })
  activeUsers: number;

  @Column({
    type: "int",
    comment: "每日新增用户数",
  })
  newUsers: number;

  @Column({
    type: "int",
    comment: "每日页面访问量",
  })
  pv: number;

  @Column({
    type: "int",
    comment: "每日IP数",
  })
  ip: number;

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
}
