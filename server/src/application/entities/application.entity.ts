import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("application")
export class Application {
  @PrimaryGeneratedColumn({ comment: "主键ID" })
  id: number;

  @Column({
    type: "varchar",
    length: 128,
    comment: "应用ID",
  })
  appId: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "应用名称",
  })
  appName: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "应用密钥",
  })
  appSecret: string;

  @Column({
    type: "int",
    comment: "应用类型",
  })
  appType: number;

  @Column({
    comment: "应用状态",
  })
  appStatus: number;

  @Column({
    type: "text",
    nullable: true,
    comment: "应用描述",
  })
  appDesc: string;

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
