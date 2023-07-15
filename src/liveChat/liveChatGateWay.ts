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
import { JoinRoomRequestDTO } from './dto/JoinRoomRequestDTO';
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
        console.log('Client connected:', client.data.user);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
        Object.keys(client.rooms).forEach((roomId) => {
            client.leave(roomId);
        });
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('roomAccessRequest')
    handleJoinRoom(client: Socket, request: JoinRoomRequestDTO) {
        console.log('roomAccess');
        this.liveChatService.connectRoom(client, request);

        client.on('disconnect', () => {
            this.liveChatService.disconnectFromRoom(
                client,
                client.data.user,
                request.peerId,
            );
        });
        client.on('chat', async (content) => {
            console.log('jai recu un message : ' + content.content);
            await this.liveChatService.sendChatToRoom(
                this.server,
                client.data.user,
                content,
                request.roomId,
            );
        });
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('chatAccessRequest')
    handleJoinConversation(client: Socket) {
        console.log('chat access');
        this.liveChatService.connect(client, client.data.user);

        client.on('disconnect', () => {
            this.liveChatService.disconnect(client, client.data.user);
        });
        client.on('chat', async (content) => {
            console.log('jai recu un message : ' + content.content);
            await this.liveChatService.sendChat(
                this.server,
                client.data.user,
                content,
            );
        });
    }
}
