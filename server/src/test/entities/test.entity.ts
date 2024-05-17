import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Test {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: "varchar", length: 200 })
  name: string;

  @Column({
    select: true,
    comment: "密码注释",
    default: "123",
    nullable: false,
  })
  password: string;

  @Column()
  age: number;

  @Generated("uuid")
  uuid: string;

  @Column({
    type: "enum",
    enum: [10, 20, 30],
    default: 10,
  })
  pageSize: number;

  @Column("simple-array")
  colors: string[];

  @Column("simple-json")
  json: { name: string; age: number };

  @Column({
    type: "varchar",
    length: 100,
    name: "ip", //数据库表中的列名
    nullable: true, //在数据库中使列NULL或NOT NULL。 默认情况下，列是nullable：false
    comment: "注释",
    select: true, //定义在进行查询时是否默认隐藏此列。 设置为false时，列数据不会显示标准查询。 默认情况下，列是select：true
    default: "xxxx", //加数据库级列的DEFAULT值
    primary: false, //将列标记为主要列。 使用方式和@ PrimaryColumn相同。
    update: true, //指示"save"操作是否更新列值。如果为false，则只能在第一次插入对象时编写该值。 默认值为"true"
    collation: "", //定义列排序规则。
  })
  ip: string;

  @CreateDateColumn({ type: "timestamp" })
  createTime: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updateTime: Date;
}
