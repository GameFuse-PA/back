import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { UserFromFrontDTO } from './Models/UserFromFrontDTO';
import { MessageForChat } from './Models/MessageForChat';
import { ConversationsService } from '../conversations/conversations.service';
import { MessageForFrontConversation } from './Models/MessageForFrontConversation';
import { UserDocument } from '../schemas/user.schema';
import { JoinRoomRequestDTO } from './dto/JoinRoomRequestDTO';

@Injectable()
export class LiveChatService {
    constructor(
        private usersService: UsersService,
        private conversationsService: ConversationsService,
    ) {}

    public connect(client: Socket, userId: string) {
        console.log('new userId connected');
        client.join(userId);
    }

    public connectRoom(client: Socket, request: JoinRoomRequestDTO) {
        console.log('new userId connected');
        client.join(request.roomId);
        client.broadcast
            .to(request.roomId)
            .emit('user-connected', request.peerId);
    }

    public disconnect(client: Socket, userId: string) {
        console.log('deconnected ' + userId);
        client.disconnect();
    }

    public disconnectFromRoom(
        client: Socket,
        user: UserFromFrontDTO,
        peerId: string,
    ) {
        client.disconnect();
        client.broadcast.to(user.roomId).emit('user-disconnected', peerId);
    }

    public async sendChat(
        server: Server,
        senderId: string,
        message: MessageForChat,
    ) {
        if (message.to === undefined || message.to === null) {
            return;
        }
        console.log("j'emet un message");
        const savedMessage = await this.conversationsService.publishMessage(
            message,
            senderId,
        );
        console.log('saved message : ' + savedMessage);
        const conversation = await this.conversationsService.updateConversation(
            savedMessage,
            senderId,
            message.to,
        );

        const sender: UserDocument = await this.usersService.findOneById(
            senderId,
        );

        const messageToReturn: MessageForFrontConversation = {
            content: savedMessage.content,
            from: {
                username: sender.username,
            },
            date: Date.now(),
            conversationId: conversation._id,
        };
        //TODO : controle que message.to est valide
        server.to(message.to).emit('new-message', messageToReturn);
    }

    public async sendChatToRoom(
        server: Server,
        senderId: string,
        message: MessageForChat,
        roomId: string,
    ) {
        console.log("j'emet un message");
        const savedMessage = await this.conversationsService.publishMessage(
            message,
            senderId,
        );
        console.log('saved message : ' + savedMessage);
        const conversation = await this.conversationsService.updateRoomChat(
            savedMessage,
            senderId,
            roomId,
        );

        const sender: UserDocument = await this.usersService.findOneById(
            senderId,
        );

        const messageToReturn: MessageForFrontConversation = {
            content: savedMessage.content,
            from: {
                username: sender.username,
            },
            date: Date.now(),
            conversationId: conversation._id,
        };
        //TODO : controle que message.to est valide
        console.log(
            'je suis ' + senderId + 'et message addressé à ' + message.to,
        );
        server.to(roomId).emit('new-message', messageToReturn);
    }
}
