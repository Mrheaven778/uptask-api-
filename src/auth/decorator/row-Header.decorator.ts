import { ExecutionContext, createParamDecorator } from "@nestjs/common";



export const RowHeader = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        
        const rowHeader = ctx.switchToHttp().getRequest();

        return rowHeader.rawHeaders;
    }
);