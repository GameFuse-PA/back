import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { UserFromFrontDTO } from './Models/UserFromFrontDTO';
import { MessageForChat } from './Models/MessageForChat';
import { ConversationsService } from '../conversations/conversations.service';
import { MessageForFrontConversation } from './Models/MessageForFrontConversation';
import { JoinGameSessionDTO } from './dto/JoinGameSessionDTO';
import { GameSessionService } from '../game-session/game-session.service';
import { JoinGameSessionVisioDTO } from './dto/JoinGameSessionVisioDTO';

@Injectable()
export class LiveChatService {
    constructor(
        private usersService: UsersService,
        private conversationsService: ConversationsService,
        private gameSessionService: GameSessionService,
    ) {}

    public connect(client: Socket, userId: string) {
        console.log('new userId connected');
        client.join(userId);
    }

    public async connectRoom(
        client: Socket,
        joinGameSessionDTO: JoinGameSessionDTO,
    ) {
        await this.gameSessionService.addUserToGameSession(
            joinGameSessionDTO.gameSessionId,
            client.data.user,
        );
        client.join(joinGameSessionDTO.conversationId);
    }

    public async joinVisio(
        client: Socket,
        joinGameSessionVisioDTO: JoinGameSessionVisioDTO,
    ) {
        client.broadcast
            .to(joinGameSessionVisioDTO.conversationId)
            .emit('user-connected', joinGameSessionVisioDTO.peerId);
    }

    public disconnect(client: Socket, userId: string) {
        console.log('deconnected ' + userId);
        client.disconnect();
    }

    public disconnectFromRoom(client: Socket, user: UserFromFrontDTO) {
        client.disconnect();
        client.broadcast.to(user.roomId).emit('user-disconnected', user.id);
    }

    public async sendChat(
        server: Server,
        senderId: string,
        message: MessageForChat,
    ) {
        /*if (message.to === undefined || message.to === null) {
            throw new BadRequestException('Any recipiend has been defined');
        }*/

        const sender = await this.usersService.findOneById(senderId);
        if (sender === undefined || sender === null) {
            throw new BadRequestException('Any sender has been defined');
        }
        const receiver = await this.usersService.findOneById(message.to);
        if (receiver === undefined || receiver === null) {
            throw new NotFoundException('Invalid receiver');
        }

        if (
            !sender.friends.includes(receiver._id) ||
            !receiver.friends.includes(sender._id)
        ) {
            throw new UnauthorizedException(
                'You need to be friend with the receiver to contact him',
            );
        }

        const savedMessage = await this.conversationsService.publishMessage(
            message,
            senderId,
        );
        const conversation = await this.conversationsService.updateConversation(
            savedMessage,
            senderId,
            message.to,
        );

        const messageToReturn: MessageForFrontConversation = {
            content: savedMessage.content,
            from: {
                username: sender.username,
            },
            date: new Date(),
            conversationId: conversation._id,
        };
        server.to(message.to).emit('new-message', messageToReturn);
    }

    public async sendChatToGameSession(
        client: Socket,
        senderId: string,
        message: MessageForChat,
        joinGameSessionDTO: JoinGameSessionDTO,
    ) {
        const sender = await this.usersService.findOneById(senderId);
        if (sender === undefined || sender === null) {
            throw new BadRequestException('Any sender has been defined');
        }
        const savedMessage = await this.conversationsService.publishMessage(
            message,
            senderId,
        );
        const conversation =
            await this.conversationsService.updateGameSessionChat(
                savedMessage,
                senderId,
                joinGameSessionDTO.gameSessionId,
            );

        const messageToReturn: MessageForFrontConversation = {
            content: savedMessage.content,
            from: {
                username: sender.username,
            },
            date: new Date(),
            conversationId: conversation._id,
        };
        client.broadcast
            .to(joinGameSessionDTO.conversationId)
            .emit('new-message', messageToReturn);
    }
}
