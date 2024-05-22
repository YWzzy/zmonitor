import { SdkBase, BasePlugin } from '@zmonitor/types';
export default class WebPerformance extends BasePlugin {
    type: string;
    constructor();
    bindOptions(): void;
    core({ transportData }: SdkBase): void;
    transform(): void;
}
