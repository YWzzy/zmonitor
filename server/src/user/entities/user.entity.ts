import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  desc: string;

  @CreateDateColumn({ type: "timestamp" })
  createTime: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updateTime: Date;
}
