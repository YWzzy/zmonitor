import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("dist_upload_log")
export class DistUploadLog {
  @PrimaryGeneratedColumn({ comment: "主键ID" })
  id: number;

  @Column({
    type: "varchar",
    length: 50,
    comment: "项目版本号",
  })
  projectVersion: string;

  @Column({
    type: "varchar",
    length: 50,
    comment: "项目环境",
  })
  projectEnv: string;

  @Column({
    type: "int",
    default: 0,
    comment: "是否使用了sourcemap打包",
  })
  isSourceMap: number;

  @Column({
    type: "varchar",
    length: 255,
    comment: "项目包地址的根目录",
  })
  rootPath: string;

  @Column({
    type: "varchar",
    length: 50,
    comment: "应用ID",
  })
  appId: string;

  @Column({
    type: "varchar",
    length: 50,
    comment: "upload-log ID",
  })
  logId: string;

  @Column({
    type: "varchar",
    length: 50,
    comment: "用户ID",
  })
  userId: string;

  @Column({
    type: "int",
    default: 0,
    comment: "该批次文件数量",
  })
  filesNumber: number;

  @Column({
    type: "int",
    default: 0,
    comment: "该批次文件总大小",
  })
  filesSize: number;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    comment: "描述信息",
  })
  description: string;

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
