import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: { origin: '*', methods: ['GET', 'POST'] },
    path: '/socket',
})
export class LiveChatController
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;
    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

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
        });
    }
}
