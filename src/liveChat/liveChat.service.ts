import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { UserFromFrontDTO } from './Models/UserFromFrontDTO';
import { MessageForChat } from './Models/MessageForChat';

@Injectable()
export class LiveChatService {
    constructor(private usersService: UsersService) {}

    public connect(client: Socket, user: UserFromFrontDTO) {
        client.join(user.roomId);
        client.broadcast.to(user.roomId).emit('user-connected', user.roomId);
    }

    public disconnect(client: Socket, user: UserFromFrontDTO) {
        client.leave(user.roomId);
        client.broadcast.to(user.roomId).emit('user-disconnected', user.roomId);
    }

    public async chat(
        client: Socket,
        user: UserFromFrontDTO,
        message: MessageForChat,
    ) {
        message.from = await this.usersService.findOneById(user.id);
        client.broadcast.to(user.roomId).emit('new-message', message);
    }
}
