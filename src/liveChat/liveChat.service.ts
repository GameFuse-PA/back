import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { MessageForChat } from './Models/MessageForChat';
import { ConversationsService } from '../conversations/conversations.service';
import { MessageForFrontConversation } from './Models/MessageForFrontConversation';
import { JoinGameSessionDTO } from './dto/JoinGameSessionDTO';
import { GameSessionService } from '../game-session/game-session.service';
import { JoinGameSessionVisioDTO } from './dto/JoinGameSessionVisioDTO';
import { ConversationDocument } from '../schemas/conversation.schema';

@Injectable()
export class LiveChatService {
    constructor(
        private usersService: UsersService,
        private conversationsService: ConversationsService,
        private gameSessionService: GameSessionService,
    ) {}

    public connect(client: Socket, userId: string) {
        client.join(userId);
    }

    public async connectRoom(
        client: Socket,
        joinGameSessionDTO: JoinGameSessionDTO,
    ) {
        try {
            await this.gameSessionService.joiningGameSessionControl(
                joinGameSessionDTO.gameSessionId,
                client.data.user,
            );
            client.join(`game-session${joinGameSessionDTO.conversationId}`);
        } catch {
            throw new ForbiddenException(
                'You do not have the right to do this action.',
            );
        }
    }

    public async joinVisio(
        client: Socket,
        joinGameSessionVisioDTO: JoinGameSessionVisioDTO,
    ) {
        client.broadcast
            .to(`game-session${joinGameSessionVisioDTO.conversationId}`)
            .emit(
                'user-connected',
                joinGameSessionVisioDTO.peerId,
                client.data.user,
            );
    }

    public disconnectFromGameSession(
        client: Socket,
        userId: string,
        conversationId: string,
    ) {
        client.leave(`game-session${conversationId}`);
        client.broadcast
            .to(`game-session${conversationId}`)
            .emit('user-disconnected', userId);
    }

    public async sendChatToConversation(
        server: Server,
        senderId: string,
        message: MessageForChat,
    ) {
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

    public async sendChat(
        client: Socket,
        server: Server,
        senderId: string,
        message: MessageForChat,
    ) {
        const conversation: ConversationDocument =
            await this.conversationsService.getConversationById(
                message.conversationId,
            );
        for (let i = 0; i < conversation.users.length; i++) {
            const newUserId = conversation.users[i].toString();
            if (newUserId == senderId) {
                if (conversation.isGameChat === true) {
                    await this.sendChatToGameSession(client, senderId, message);
                } else {
                    await this.sendChatToConversation(
                        server,
                        senderId,
                        message,
                    );
                }
                return;
            }
        }
        throw new UnauthorizedException(
            'You do not have the right to send this message here',
        );
    }

    public async sendChatToGameSession(
        client: Socket,
        senderId: string,
        message: MessageForChat,
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
                message.conversationId,
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
            .to(`game-session${message.conversationId}`)
            .emit('new-message', messageToReturn);
    }
}
