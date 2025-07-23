import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Authorization = createParamDecorator(
    (data: any, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        return request.headers['authorization'];
    }
);  