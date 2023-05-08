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
import { UserFromFrontDTO } from '../UserFromFrontDTO';

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
    handleJoinRoom(client: Socket, user: UserFromFrontDTO) {
        client.join(user.roomId);
        client.broadcast.to(user.roomId).emit('user-connected', user.peerId);

        client.on('disconnect', () => {
            client.broadcast
                .to(user.roomId)
                .emit('user-disconnected', user.peerId);
        });

        client.on('chat', (content) => {
            client.broadcast.to(user.roomId).emit('new-message', content);
            const message: MessageDTO = {
                content: content,
                senderId: user.peerId,
                date: new Date(),
                conversationId: user.roomId,
            };
            this.liveChatService.postMessage(message);
        });
    }
}
