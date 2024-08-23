import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BookmarkLog } from './bookmarkLogs.entity';

@Entity('bookmarks')
export class Bookmark {
    @PrimaryGeneratedColumn({ comment: "主键ID" })
    id: number;

    @Column({ type: 'varchar', length: 36 })
    bookId: string;  // 这将对应 BookmarkLog 的 id

    @Column({ type: 'varchar', length: 12 })
    type: string;

    @Column({ type: 'varchar', length: 255 })
    fileName: string;

    @Column({ type: 'varchar', length: 36 })
    uuid: string;

    @Column({ type: 'int', default: 0 })
    collectionId: number;

    @Column({ type: 'varchar', length: 36, nullable: true })
    pid: string | null;

    @Column({ type: 'varchar', length: 36, nullable: true })
    creator: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 2083, default: null })
    url: string | null;

    @Column({ type: 'varchar', length: 128, default: null })
    domain: string | null;

    @Column({ type: 'int', default: 1 })
    isExpanded: number;

    @Column({ type: 'int', default: 0 })
    important: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    created: string | null;

    @Column({ type: 'varchar', length: 5000, nullable: true })
    icon: string | null;

    @Column({ type: 'varchar', length: 255, default: null })
    name: string;

    @Column({ type: 'varchar', length: 2083, default: null })
    description: string | null;

    @Column({ type: 'varchar', length: 500, default: null })
    cover: string | null;

    @Column({ type: 'varchar', length: 36, default: null })
    coverType: string | null;

    @Column({ type: 'varchar', length: 2083, default: null })
    href: string | null;

    @Column({ type: 'varchar', length: 255, default: null })
    tags: string | null;

    @Column({ type: 'varchar', length: 255, default: null })
    note: string | null;

    @Column({ type: 'int', default: 0 })
    sort: number;

    @Column({ type: 'int', default: 0 })
    removed: boolean;

    @ManyToOne(() => BookmarkLog, log => log.bookmarks)
    log: BookmarkLog;
}
