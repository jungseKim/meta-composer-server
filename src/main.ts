import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { SocketIoAdapter } from './adapters/socket-io.adapters';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  
  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ['Authorization'],
    allowedHeaders: 'http://localhost:3000',
  });
  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
