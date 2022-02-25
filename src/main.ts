import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new WsAdapter(app));

  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Meta-Composer Api')
    .setDescription('Meta-Composer Api')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(4000);
}
bootstrap();
//