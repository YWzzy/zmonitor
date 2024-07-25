import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ProjectInfo = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const appId = request.headers['appid'];
        const projectEnv = request.headers['projectenv'];
        const isSourceMapStr = request.headers['issourcemap'];
        const isSourceMap = isSourceMapStr === 'true' || isSourceMapStr === '1' || isSourceMapStr ? true : false;
        return { appId, projectEnv, isSourceMap };
    },
);
