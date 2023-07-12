import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { UserFromFrontDTO } from './Models/UserFromFrontDTO';
import { MessageForChat } from './Models/MessageForChat';
import { ConversationsService } from '../conversations/conversations.service';

@Injectable()
export class LiveChatService {
    constructor(
        private usersService: UsersService,
        private conversationsService: ConversationsService,
    ) {}

    private connectedUsers: string[] = [];

    public connect(client: Socket, user: UserFromFrontDTO) {
        console.log('tentative de connexion');
        if (!this.connectedUsers.includes(user.id.toString())) {
            this.connectedUsers.push(user.id.toString());
            console.log('users connected : ' + this.connectedUsers);
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
        this.connectedUsers.forEach((item, index) => {
            if (item === user.id) {
                this.connectedUsers.splice(index, 1);
            }
        });
    }

    public quitRoom(client: Socket, user: UserFromFrontDTO) {
        console.log('je leave la room ' + user.roomId);
        client.leave(user.roomId);
        this.connectedUsers.forEach((item, index) => {
            if (item === user.id) {
                this.connectedUsers.splice(index, 1);
            }
        });
    }

    public async sendChat(
        client: Socket,
        user: UserFromFrontDTO,
        message: MessageForChat,
    ) {
        console.log(this.connectedUsers);
        console.log("j'emet un message");
        message.from = await this.usersService.findOneById(user.id);
        const savedMessage = this.conversationsService.publishMessage(message);
        //TODO : controle que le user et la conv sont ok
        if (savedMessage != null) {
            client.broadcast.to(user.roomId).emit('new-message', message);
        }
    }
}
