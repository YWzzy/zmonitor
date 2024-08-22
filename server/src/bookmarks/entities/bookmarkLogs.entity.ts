import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Bookmark } from './bookmark.entity';

@Entity('bookmark_logs')
export class BookmarkLog {
    @PrimaryGeneratedColumn({ comment: "日志主键ID" })
    id: string; // 使用自定义类型与 Bookmark 的 bookId 字段匹配

    @Column({ type: 'varchar', length: 255 })
    fileName: string;

    @Column({ type: 'varchar', length: 50, comment: '操作人' })
    operator: string;

    @Column({ type: 'varchar', length: 50, comment: '操作类型（如创建、更新、删除）' })
    operation: string;

    @CreateDateColumn({ type: 'timestamp', comment: '操作时间' })
    createdAt: Date;

    @CreateDateColumn({ type: 'timestamp', comment: '更新时间' })
    updateAt: Date;

    @Column({ type: 'varchar', length: 255, nullable: true, comment: '备注或额外信息' })
    note: string | null;

    @OneToMany(() => Bookmark, bookmark => bookmark.log)
    bookmarks: Bookmark[];
}
