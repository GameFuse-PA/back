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
import { MessageForDb } from './Models/MessageForDb';
import { WebSocketAuthGuard } from '../guards/WebSocketAuthGuard';
import { UserFromFrontDTO } from '../UserFromFrontDTO';
import { UsersService } from '../users/users.service';
import { ChatFormatter } from './ChatFormatter';

@WebSocketGateway({
    cors: { origin: '*', methods: ['GET', 'POST'] },
    path: '/socket',
})
export class LiveChatController
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        private liveChatService: LiveChatService,
        private usersService: UsersService,
    ) {}
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
            const chatToFront = ChatFormatter.makeChatForFront(
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
            this.liveChatService.postMessage(messageForDb);
        });
    }
}
