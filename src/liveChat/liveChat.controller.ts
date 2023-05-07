import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { UseGuards, Request } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LiveChatService } from './liveChat.service';
import { MessageDTO } from './MessageDTO';
import { WebSocketAuthGuard } from '../guards/WebSocketAuthGuard';

@WebSocketGateway({
    cors: { origin: '*', methods: ['GET', 'POST'] },
    path: '/socket',
})
export class LiveChatController
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(private liveChatService: LiveChatService) {}
    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('join-room')
    handleJoinRoom(client: Socket, payload: any) {
        console.log('nono debut de handleJoinRoom');
        console.log(payload);
        const roomId = payload[0];
        const userId = payload[1];
        client.join(roomId);
        client.broadcast.to(roomId).emit('user-connected', userId);

        client.on('disconnect', () => {
            client.broadcast.to(roomId).emit('user-disconnected', userId);
        });

        client.on('chat', (content) => {
            client.broadcast.to(roomId).emit('new-message', content);
            const message: MessageDTO = {
                content: content,
                senderId: userId,
                date: new Date(),
                conversationId: roomId,
            };
            this.liveChatService.postMessage(message);
        });
    }
}
