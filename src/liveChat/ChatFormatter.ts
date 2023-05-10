import { UsersService } from '../users/users.service';
import { MessageForFront } from './Models/MessageForFront';

export class ChatFormatter {
    static async makeChatForFront(
        content: string,
        userId: string,
        usersService: UsersService,
    ) {
        console.log("coucou in chatformatter avant")
        const now = new Date();
        const time = now.getTime();
        const user = await usersService.findOneById(userId);
        const chat: MessageForFront = {
            content: content,
            time: time,
            isMe: false,
            userName: user.username,
            //userPhoto: user.avatar,
        };
        console.log("coucou avant de return chat", chat)
        return chat;
    }
}
