import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import {UseGuards, Request, Controller, Post, Body, Param, Get} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LiveChatService } from './liveChat.service';
import { MessageForDb } from './Models/MessageForDb';
import { WebSocketAuthGuard } from '../guards/WebSocketAuthGuard';
import { UsersService } from '../users/users.service';
import { ChatFormatter } from './ChatFormatter';
import {UserFromFrontDTO} from "../UserFromFrontDTO";

@WebSocketGateway({
    cors: { origin: '*', methods: ['GET', 'POST'] },
    path: '/socket',
})
//@Controller()
export class LiveChatController
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        private liveChatService: LiveChatService,
        private usersService: UsersService,
    ) {}

    @Get('/createRoom/:roomId')
    async createRoom(@Param('roomId') roomId: string) {
        console.log("createRoom begenning");
        return await this.liveChatService.createRoom(roomId);
    }

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('join-room')
    handleJoinRoom(client: Socket, user: UserFromFrontDTO) {
        client.join(user.roomId);
        client.broadcast.to(user.roomId).emit('user-connected', user.peerId);

        client.on('disconnect', () => {
            client.broadcast
                .to(user.roomId)
                .emit('user-disconnected', user.peerId);
        });

        client.on('chat', async (content) => {
            const chatToFront = await ChatFormatter.makeChatForFront(
                content,
                user.id,
                this.usersService
            );
            client.broadcast.to(user.roomId).emit('new-message', chatToFront);
            const messageForDb: MessageForDb = {
                content: content,
                senderId: user.id,
                date: new Date(),
                conversationId: user.roomId,
            };
            this.liveChatService.postMessage(messageForDb, user.roomId);
        });
    }
}
