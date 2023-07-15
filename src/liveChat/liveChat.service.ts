import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { UserFromFrontDTO } from './Models/UserFromFrontDTO';
import { MessageForChat } from './Models/MessageForChat';
import { ConversationsService } from '../conversations/conversations.service';
import { MessageForFrontConversation } from './Models/MessageForFrontConversation';
import { UserDocument } from '../schemas/user.schema';
import { JoinRoomRequestDTO } from './dto/JoinRoomRequestDTO';
import { RoomService } from '../room/room.service';

@Injectable()
export class LiveChatService {
    constructor(
        private usersService: UsersService,
        private conversationsService: ConversationsService,
        private roomService: RoomService,
    ) {}

    public connect(client: Socket, userId: string) {
        console.log('new userId connected');
        client.join(userId);
    }

    public async connectRoom(client: Socket, request: JoinRoomRequestDTO) {
        await this.roomService.addUserToRoom(request.roomId, client.data.user);
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
            throw new BadRequestException('Any recipiend has been defined');
        }

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
            date: Date.now(),
            conversationId: conversation._id,
        };
        server.to(message.to).emit('new-message', messageToReturn);
    }

    public async sendChatToRoom(
        client: Socket,
        senderId: string,
        message: MessageForChat,
        roomId: string,
    ) {
        const room = await this.roomService.getRoom(roomId);
        const sender = await this.usersService.findOneById(senderId);
        if (sender === undefined || sender === null) {
            throw new BadRequestException('Any sender has been defined');
        }
        if (!room.idUsers.includes(sender._id)) {
            throw new UnauthorizedException(
                'You need to join the room to send messages',
            );
        }
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

        const messageToReturn: MessageForFrontConversation = {
            content: savedMessage.content,
            from: {
                username: sender.username,
            },
            date: Date.now(),
            conversationId: conversation._id,
        };
        console.log('jenvoie le msg')
        client.broadcast.to(roomId).emit('new-message', messageToReturn);
    }
}
