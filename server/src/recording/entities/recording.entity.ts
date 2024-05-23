import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Recording {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalFileName: string;

  @Column()
  storedFilePath: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createTime: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  uploadTime: Date;
}
