import { SdkBase, RecordScreenOption, BasePlugin } from '@zmonitor/types';
export default class RecordScreen extends BasePlugin {
    type: string;
    recordScreentime: number;
    recordScreenTypeList: string[];
    constructor(params?: RecordScreenOption);
    bindOptions(params: RecordScreenOption): void;
    core({ transportData, options }: SdkBase): void;
    transform(): void;
}
