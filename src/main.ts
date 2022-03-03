import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { SocketIoAdapter } from './adapters/socket-io.adapters';
import { setupSwagger } from './util/swagger';
import * as path from 'path';
import { TransformResponseInterceptor } from './common/interceptors/transformResponse.interceptor';
import session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtGuard } from './auth/jwt.guard';
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
  app.use(
    session({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      resave: false,
      saveUninitialized: false,
    }));


  app.use(cookieParser());
  app.useGlobalGuards(
    // new JwtGuard
    );
 
  const config = new DocumentBuilder()
    .setTitle('Meta-Composer Api')
    .setDescription('Meta-Composer Api')
    .setVersion('1.0')
    .addTag('api')
    // .addBearerAuth()
    .build();
    
    const document = SwaggerModule.createDocument(app, config);
    
    SwaggerModule.setup('api-docs', app, document);

  app.useGlobalInterceptors(new TransformResponseInterceptor());
 
  await app.listen(4000);
}
bootstrap();
