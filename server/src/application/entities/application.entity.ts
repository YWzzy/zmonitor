import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("application")
export class Application {
  @PrimaryGeneratedColumn({
    comment: "应用ID，自动递增的主键",
  })
  appId: number;

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
    type: "varchar",
    length: 255,
    comment: "应用类型",
  })
  appType: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "应用状态",
  })
  appStatus: string;

  @Column({
    type: "text",
    nullable: true,
    comment: "应用描述",
  })
  appDesc: string;

  @CreateDateColumn({
    type: "timestamp",
    comment: "创建时间"
  })
  createTime: Date;

  @UpdateDateColumn({
    type: "timestamp",
    comment: "更新时间"
  })
  updateTime: Date;
}
