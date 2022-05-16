import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user.entity";
import { TokenPayload } from "src/modules/auth/token-payload.interface";
import { Repository } from "typeorm";
import { AuthenticatedSocket, LessonSocket } from "../custom-sockets/my-socket";
import * as jwt from "jsonwebtoken";

export type SocketMiddleware = (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void,
) => void;
export const WSAuthMiddleware = (
  userRepository: Repository<User>,
): SocketMiddleware => {
  return async (socket: AuthenticatedSocket, next) => {
    try {
      const authToken = socket.handshake.auth.token?.split(" ")[1];
      const jwtPayload: TokenPayload = <TokenPayload>(
        jwt.verify(authToken, process.env.JWT_SECRET)
      );

      const user = await userRepository.findOne(jwtPayload["userId"]);
      if (user) {
        socket.user = user;
        next();
      } else {
        next({
          name: "Unauthorizaed",
          message: "Unauthorizaed",
        });
      }
    } catch (error) {
      next({
        name: "Unauthorizaed",
        message: "Unauthorizaed",
      });
    }
  };
};

export const WSAuthMiddleware2 = (
  userRepository: Repository<User>,
): SocketMiddleware => {
  return async (socket: LessonSocket, next) => {
    try {
      const { lessonId } = socket.handshake.query;
    } catch (error) {}
  };
};
