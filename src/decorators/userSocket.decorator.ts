import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserSocketDecorator = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToWs().getClient();
    // const user = await this.userRepository.findOne(payload['userId']);
    return request.user;
  },
);
