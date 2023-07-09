import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatFormatter } from './ChatFormatter';
import { UsersService } from '../users/users.service';
import { UserFromFrontDTO } from './Models/UserFromFrontDTO';
import { MessageForChat } from './Models/MessageForChat';

@Injectable()
export class LiveChatService {
    constructor(private usersService: UsersService) {}

    public connect(client: Socket, user: UserFromFrontDTO) {
        client.join(user.conversationId);
        client.broadcast
            .to(user.conversationId)
            .emit('user-connected', user.peerId);
    }

    public connectToChat(client: Socket, message: MessageForChat) {
        client.join(message.conversationId);
        client.broadcast.to(message.conversationId).emit('user-connected');
    }

    public disconnect(client: Socket, user: UserFromFrontDTO) {
        client.broadcast
            .to(user.conversationId)
            .emit('user-disconnected', user.peerId);
    }

    public disconnectFromChat(client: Socket, messageForChat: MessageForChat) {
        client.broadcast.to(messageForChat.conversationId).emit('user-left');
    }

    public async chatToRoom(
        client: Socket,
        user: UserFromFrontDTO,
        content: string,
    ) {
        console.log('new msg to room');
        const userDocument = await this.usersService.findOneById(user.id);
        const chatToFront = await ChatFormatter.makeChatForRoom(
            content,
            userDocument.username,
        );
        client.broadcast
            .to(user.conversationId)
            .emit('new-message-room', chatToFront);
    }

    public async chatToConversation(
        client: Socket,
        messageForChat: MessageForChat,
        userId: string,
    ) {
        console.log('new msg to conversation');
        const userDocument = await this.usersService.findOneById(userId);
        const chatToFront = await ChatFormatter.makeChatForConversation(
            messageForChat,
            userDocument.username,
        );
        client.broadcast
            .to(messageForChat.conversationId)
            .emit('new-message-conversation', chatToFront);
    }
}
