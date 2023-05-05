import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { LiveChatService } from './liveChat.service';
import { MessageDTO } from './MessageDTO';

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

    @UseGuards(AuthGuard)
    @SubscribeMessage('join-room')
    handleJoinRoom(client: Socket, payload: any) {
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
                date: Date.now(),
                conversationId: roomId,
            };
            this.liveChatService.postMessage(message);
        });
    }
}
