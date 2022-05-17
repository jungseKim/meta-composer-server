import { LessonSocket } from "../custom-sockets/my-socket";
import { SocketMiddleware } from "./auth.middleware";

export const WSLessonMiddleware = (): SocketMiddleware => {
  return async (socket: LessonSocket, next) => {
    try {
      const lessonId = socket.handshake.query.lessonId;
      if (typeof lessonId !== "string") {
        return next({
          name: "bad",
          message: "fucking man",
        });
      }
      socket.lessonId = parseInt(lessonId);
    } catch (error) {
      next({
        name: "bad",
        message: "fucking man",
      });
    }
  };
};
