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
import { JoinGameSessionDTO } from './dto/JoinGameSessionDTO';
import { MessageForFrontConversation } from './Models/MessageForFrontConversation';
import { MessageForChat } from './Models/MessageForChat';
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
        Object.keys(client.rooms).forEach((roomId) => {
            client.leave(roomId);
        });
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('connect-game-session') //roomAccessRequest
    async handleJoinRoom(
        client: Socket,
        joinGameSessionDTO: JoinGameSessionDTO,
    ) {
        await this.liveChatService.connectRoom(client, joinGameSessionDTO);
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('connect-game-session-visio')
    async handleJoinVisio(client: Socket, content: any) {
        await this.liveChatService.joinVisio(client, content);
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('disconnect-game-session')
    async disconnect(client: Socket, gameSessionId: string) {
        this.liveChatService.disconnectFromGameSession(
            client,
            client.data.user,
            gameSessionId,
        );
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('chat')
    async gameSessionChat(client: Socket, content: MessageForChat) {
        await this.liveChatService.sendChat(
            client,
            this.server,
            client.data.user,
            content,
        );
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('connect-conversation')
    handleJoinConversation(client: Socket) {
        this.liveChatService.connect(client, client.data.user);
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('disconnect-conversation')
    handleDisconnectConversation(client: any) {
        client.leave(client.data.user);
    }
}
