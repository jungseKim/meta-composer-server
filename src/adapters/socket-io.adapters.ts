import { UseGuards } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Request } from "express";
export class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    // options.allowRequest = async (request: Request, allowFunction) => {
    //   console.log(request.headers);
    //   return allowFunction(null, true);
    // };
    const server = super.createIOServer(port, options);

    return server;
  }
}
