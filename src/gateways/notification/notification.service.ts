import { createQueryBuilder } from 'typeorm';
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import console from 'console';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { ChatRoom } from 'src/entities/chatRoom.entity';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Notification } from 'src/entities/notification.entity';
@Injectable()
export class NotificationService {
  clients: Record<number, Socket>;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {
    this.clients = {};
  }

  public async auth(client: Socket): Promise<ChatRoom[]> {
    const authToken = client.handshake.auth.token?.split(' ')[1];
    // const authToken = client.handshake.headers.authorization?.split(' ')[1];
    if (!authToken) {
      client.disconnect();
      return;
    }

    const jwtPayload: TokenPayload = <TokenPayload>(
      jwt.verify(authToken, process.env.JWT_SECRET)
    );

    const user = await this.userRepository.findOne(jwtPayload['userId']);
    if (!user) {
      client.disconnect();
      return;
    }
    this.clients[user.id] = client;
  }

  public disconnection(client: Socket) {
    const userId: number = client.data.userId;
    delete this.clients[userId];
  }

  public async pushMessage(userId: number, message: Message) {
    const client = this.clients[userId];
    client?.emit('push-message', message);
  }
  //-----------------controller----------------------------
  public async getNotifitions(user: User, page: number, perPage: number) {
    const userId = user.id;

    return await this.notificationRepository
      .createQueryBuilder('message')
      .orderBy('message.created_at', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }
}
