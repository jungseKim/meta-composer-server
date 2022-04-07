import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // console.log(request.user);
    //테스트로 이거 찍어보기.
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
