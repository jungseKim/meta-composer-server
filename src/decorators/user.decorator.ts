import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);

// 만약 안될 경우 ->>
// export const UserDecorator = createParamDecorator(
//   (_data: unknown, context: ExecutionContext) => {
//       if (context.getType() === 'http') {
//           return context.switchToHttp().getRequest().user;
//       }

//       const ctx = GqlExecutionContext.create(context);
//       return ctx.getContext().req.user;
//   }
// )
