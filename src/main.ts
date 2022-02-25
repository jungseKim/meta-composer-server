import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { SocketIoAdapter } from './adapters/socket-io.adapters';
import { setupSwagger } from './util/swagger';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    '.env',
    // process.env.NODE_ENV === 'dev'
    //   ? '.env'
    //   : process.env.NODE_ENV === 'stage'
    //   ? '.stage.env'
    //   : '.development.env',
  ),
});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  setupSwagger(app);
  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ['Authorization'],
    // allowedHeaders: 'http://localhost:3000/*',
  });
  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
