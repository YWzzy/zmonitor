import { EVENTTYPES } from '@zmonitor/common';
import { ErrorTarget, RouteHistory, HttpData } from '@zmonitor/types';
declare const HandleEvents: {
    handleHttp(data: HttpData, type: EVENTTYPES): void;
    handleError(ev: ErrorTarget): void;
    handleHistory(data: RouteHistory): void;
    handleHashchange(data: HashChangeEvent): void;
    handleUnhandleRejection(ev: PromiseRejectionEvent): void;
    handleWhiteScreen(): void;
};
export { HandleEvents };
