import { log } from './core/index';
import { InitOptions, VueInstance } from '@zmonitor/types';
declare function init(options: InitOptions): void;
declare function install(Vue: VueInstance, options: InitOptions): void;
declare function errorBoundary(err: Error): void;
declare function use(plugin: any, option: any): void;
declare const _default: {
    SDK_VERSION: string;
    SDK_NAME: string;
    init: typeof init;
    install: typeof install;
    errorBoundary: typeof errorBoundary;
    use: typeof use;
    log: typeof log;
};
export default _default;
