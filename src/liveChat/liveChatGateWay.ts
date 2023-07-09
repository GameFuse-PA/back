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
import { UserFromFrontDTO } from './Models/UserFromFrontDTO';

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
        this.liveChatService.connect(client, user);

        client.on('disconnect', () => {
            this.liveChatService.disconnect(client, user);
        });

        client.on('chat', async (content) => {
            console.log('jai recu un message : ' + content);
            this.liveChatService.chat(client, user, content);
        });
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('roomLeaveRequest')
    handleLeaveRoom(client: Socket, user: UserFromFrontDTO) {
        this.liveChatService.disconnect(client, user);
    }
}
