import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ comment: "主键ID" })
  id: number;

  @Column({ type: "varchar", length: 255, comment: "用户名称" })
  name: string;

  @Column({ unique: true, type: "varchar", length: 255, comment: "用户账号" })
  account: string;

  @Column({ type: "varchar", length: 255, comment: "用户密码" })
  password: string;

  @Column({ type: "varchar", default: "", length: 255, comment: "用户描述" })
  desc: string;

  @Column({ type: "boolean", default: false, comment: "是否删除" })
  isDeteled: boolean;

  @CreateDateColumn({ type: "timestamp", comment: "创建时间" })
  createTime: Date;

  @UpdateDateColumn({ type: "timestamp", comment: "更新时间" })
  updateTime: Date;
}
