import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Performance } from "./performance.entity";

@Entity("resource_performance")
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: "资源名称" })
  name: string;

  @Column({ comment: "资源的入口类型" })
  entryType: string;

  @Column("float", { comment: "资源的开始时间" })
  startTime: number;

  @Column("float", { comment: "资源的持续时间" })
  duration: number;

  @Column({ comment: "资源的发起类型" })
  initiatorType: string;

  @Column({ comment: "资源的传输类型" })
  deliveryType: string;

  @Column({ comment: "下一跳协议" })
  nextHopProtocol: string;

  @Column({ comment: "渲染阻塞状态" })
  renderBlockingStatus: string;

  @Column("float", { comment: "工作线程开始时间" })
  workerStart: number;

  @Column("float", { comment: "重定向开始时间" })
  redirectStart: number;

  @Column("float", { comment: "重定向结束时间" })
  redirectEnd: number;

  @Column("float", { comment: "抓取开始时间" })
  fetchStart: number;

  @Column("float", { comment: "域名查找开始时间" })
  domainLookupStart: number;

  @Column("float", { comment: "域名查找结束时间" })
  domainLookupEnd: number;

  @Column("float", { comment: "连接开始时间" })
  connectStart: number;

  @Column("float", { comment: "安全连接开始时间" })
  secureConnectionStart: number;

  @Column("float", { comment: "连接结束时间" })
  connectEnd: number;

  @Column("float", { comment: "请求开始时间" })
  requestStart: number;

  @Column("float", { comment: "响应开始时间" })
  responseStart: number;

  @Column("float", { comment: "第一个中间响应开始时间" })
  firstInterimResponseStart: number;

  @Column("float", { comment: "响应结束时间" })
  responseEnd: number;

  @Column({ comment: "资源的传输大小" })
  transferSize: number;

  @Column({ comment: "资源的编码后大小" })
  encodedBodySize: number;

  @Column({ comment: "资源的解码后大小" })
  decodedBodySize: number;

  @Column({ comment: "响应状态码" })
  responseStatus: number;

  @Column("simple-json", { nullable: true, comment: "服务器定时信息" })
  serverTiming: any[];

  @Column({ comment: "资源的缓存状态" })
  isCache: boolean;

  @CreateDateColumn({ type: "timestamp", comment: "记录的创建时间" })
  createTime: Date;

  @ManyToOne(() => Performance, (performance) => performance.resourceList)
  performance: Performance;
}
