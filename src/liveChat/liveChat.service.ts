import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UserFromFrontDTO } from '../UserFromFrontDTO';
import { ChatFormatter } from './ChatFormatter';
import { UsersService } from '../users/users.service';

@Injectable()
export class LiveChatService {
    constructor(private usersService: UsersService) {}

    public disconnect(client: Socket, user: UserFromFrontDTO) {
        client.broadcast.to(user.roomId).emit('user-disconnected', user.peerId);
    }

    public async chat(client: Socket, user: UserFromFrontDTO, content: string) {
        const userDocument = await this.usersService.findOneById(user.id);
        const chatToFront = await ChatFormatter.makeChatForFront(
            content,
            userDocument.username,
        );
        client.broadcast.to(user.roomId).emit('new-message', chatToFront);
    }
}
