import { UsersService } from '../users/users.service';
import { MessageForFront } from './Models/MessageForFront';

export class ChatFormatter {
    static async makeChatForFront(content: string, userName: string) {
        const now = new Date();
        const time = now.getTime();
        const chat: MessageForFront = {
            content: content,
            time: time,
            isMe: false,
            userName: userName,
            //userPhoto: user.avatar,
        };
        return chat;
    }
}
