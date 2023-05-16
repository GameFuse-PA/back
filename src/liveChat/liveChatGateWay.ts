import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LiveChatService } from './liveChat.service';
import { WebSocketAuthGuard } from '../guards/WebSocketAuthGuard';
import { UserFromFrontDTO } from '../UserFromFrontDTO';

@WebSocketGateway({
    cors: { origin: '*', methods: ['GET', 'POST'] },
    path: '/socket',
})
export class LiveChatGateWay
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
    @SubscribeMessage('roomAccessRequest')
    handleJoinRoom(client: Socket, user: UserFromFrontDTO) {
        client.join(user.roomId);
        client.broadcast.to(user.roomId).emit('user-connected', user.peerId);

        client.on('disconnect', () => {
            this.liveChatService.disconnect(client, user);
        });

        client.on('chat', async (content) => {
            this.liveChatService.chat(client, user, content);
        });
    }
}
