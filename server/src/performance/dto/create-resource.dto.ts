import { IsString, IsNotEmpty, IsInt, IsJSON } from "class-validator";

export class CreateResourceDto {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  initiatorType: string;
  deliveryType: string;
  nextHopProtocol?: string;
  renderBlockingStatus?: string;
  workerStart: number;
  redirectStart: number;
  redirectEnd: number;
  fetchStart: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  secureConnectionStart?: number;
  connectEnd: number;
  requestStart: number;
  responseStart: number;
  firstInterimResponseStart: number;
  responseEnd: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
  responseStatus: number;
  serverTiming?: any;
  isCache: boolean;
  @IsNotEmpty()
  createTime: Date;
}
