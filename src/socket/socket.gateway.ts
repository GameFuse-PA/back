import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { WebSocketAuthGuard } from "../guards/WebSocketAuthGuard";

@WebSocketGateway({
    cors: { origin: '*', methods: ['GET', 'POST'] },
    path: '/sockets',
})
export class SocketGateway {
    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('action-runner')
    handleActionRunner(client: any, payload: any) {
        client
            .to(`runner${payload.gameSessionId}`)
            .emit('action-runner', payload.action);
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('connect-runner')
    handleConnectRunner(client: any, gameSessionId: string) {
        client.join(`runner${gameSessionId}`);
    }

    @UseGuards(WebSocketAuthGuard)
    @SubscribeMessage('disconnect-runner')
    handleDisconnectRunner(client: any, gameSessionId: string) {
        client.leave(`runner${gameSessionId}`);
    }
}
