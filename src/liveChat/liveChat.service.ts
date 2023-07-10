import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { UserFromFrontDTO } from './Models/UserFromFrontDTO';
import { MessageForChat } from './Models/MessageForChat';
import { User } from '../schemas/user.schema';

@Injectable()
export class LiveChatService {
    constructor(private usersService: UsersService) {}

    public connect(client: Socket, user: UserFromFrontDTO) {
        console.log('tentative de connexion');
        if (!client.rooms.has(user.roomId)) {
            client.join(user.roomId);
            console.log('je me connecte au socket ' + user.roomId);
            client.broadcast
                .to(user.roomId)
                .emit('user-connected', user.roomId);
        } else {
            console.log('already connected');
        }
    }

    public disconnect(client: Socket, user: UserFromFrontDTO) {
        console.log('deconnected ' + user.roomId);
        client.disconnect();
    }

    public quitRoom(client: Socket, user: UserFromFrontDTO) {
        console.log('je leave la room ' + user.roomId);
        client.leave(user.roomId);
    }

    public async sendChat(
        client: Socket,
        user: UserFromFrontDTO,
        message: MessageForChat,
    ) {
        console.log("j'emet un message");
        message.from = await this.usersService.findOneById(user.id);
        //TODO : controle que le user et la conv sont ok
        client.broadcast.to(user.roomId).emit('new-message', message);
    }
}
