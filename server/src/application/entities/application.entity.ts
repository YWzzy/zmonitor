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

  @Column({
    type: "varchar",
    length: 128,
    comment: "创建人ID",
  })
  userKey: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "应用部署服务器地址",
  })
  deployServer: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "应用包地址",
  })
  packageUrl: string;

  @Column({
    type: "varchar",
    length: 255,
    comment: "录屏文件存放地址",
  })
  recordingStorage: string;

  @Column({
    type: "boolean",
    default: false,
    comment: "是否开启录屏",
  })
  enableRecording: boolean;

  @Column({
    type: "boolean",
    default: false,
    comment: "是否只异常上报",
  })
  reportErrorsOnly: boolean;

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
