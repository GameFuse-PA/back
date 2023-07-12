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

    public static userId: string;

    constructor(private liveChatService: LiveChatService) {}

    handleConnection(client: Socket) {
        console.log('Client connected:', LiveChatGateWay.userId);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
        Object.keys(client.rooms).forEach((roomId) => {
            client.leave(roomId);
        });
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('roomAccessRequest')
    handleJoinRoom(client: Socket, user: UserFromFrontDTO) {
        console.log('le userId appelant est : ' + user.id);
        client.on('roomAccessRequest', () => {
            console.log('je me connecte a une romm : ' + user.roomId);
            this.liveChatService.connect(client, LiveChatGateWay.userId);
        });

        client.on('disconnect', () => {
            this.liveChatService.disconnect(client, LiveChatGateWay.userId);
        });
        /*client.on('chat', async (content) => {
            console.log('jai recu un message : ' + content.content);
            console.log(client.id);
            await this.liveChatService.sendChat(client, user, content);
        });*/
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('chatAccessRequest')
    handleJoinConversation(client: Socket) {
        console.log('le userId appelant est : ' + LiveChatGateWay.userId);
        client.on('chatAccessRequest', () => {
            this.liveChatService.connect(client, LiveChatGateWay.userId);
        });

        client.on('disconnect', () => {
            this.liveChatService.disconnect(client, LiveChatGateWay.userId);
        });
        client.on('chat', async (content) => {
            console.log('jai recu un message : ' + content.content);
            await this.liveChatService.sendChat(
                this.server,
                //ICI LE USERID
                content,
            );
        });
    }
}
