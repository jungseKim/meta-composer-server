import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { SocketIoAdapter } from "./adapters/socket-io.adapters";
import { setupSwagger } from "./util/swagger";
import * as path from "path";
import { TransformResponseInterceptor } from "./common/interceptors/transformResponse.interceptor";
import session from "express-session";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { JwtGuard } from "./modules/auth/jwt.guard";
dotenv.config({
  path: path.resolve(".env"),
});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  setupSwagger(app);
  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ["Authorization"],
    // allowedHeaders: 'http://localhost:3000/*',
  });

  app.use(cookieParser());

  await app.listen(4000);
}
bootstrap();
