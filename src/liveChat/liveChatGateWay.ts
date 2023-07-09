import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Request, UseGuards } from "@nestjs/common";
import { Server, Socket } from 'socket.io';
import { LiveChatService } from './liveChat.service';
import { WebSocketAuthGuard } from '../guards/WebSocketAuthGuard';
import { UserFromFrontDTO } from './Models/UserFromFrontDTO';
import { MessageForChat } from "./Models/MessageForChat";
import { UsersService } from "../users/users.service";

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
        console.log("je reçois quelque chose dans les room")
        this.liveChatService.connect(client, user);

        client.on('disconnect', () => {
            this.liveChatService.disconnect(client, user);
        });

        client.on('chat', async (content) => {
            this.liveChatService.chatToRoom(client, user, content);
        });
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('conversationAccessRequest')
    handleJoinChat(@Request() req, client: Socket, messageForChat: MessageForChat) {
        console.log("je reçois quelque chose dans les conversations")
        this.liveChatService.connectToChat(client, messageForChat);

        client.on('disconnectFromChat', () => {
            this.liveChatService.disconnectFromChat(client, messageForChat);
        });

        client.on('chatConversation', async (messageFromFront) => {
            console.log(messageFromFront);
            this.liveChatService.chatToConversation(
                client,
                messageFromFront,
                req.userId,
            );
        });
    }
}
