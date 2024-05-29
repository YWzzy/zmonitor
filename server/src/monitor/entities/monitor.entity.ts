import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Monitor {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  appId: string;

  @Column({ type: "varchar", length: 255 })
  type: string;

  @CreateDateColumn({ type: "timestamp" })
  createTime: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updateTime: Date;
}
