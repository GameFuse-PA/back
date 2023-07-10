import { Controller, Put, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { AuthGuard } from '../guards/auth.guard';
import { MessageForChat } from '../liveChat/Models/MessageForChat';

@Controller('conversations')
export class ConversationsController {
    constructor(private conversationService: ConversationsService) {}

    @Put('/message')
    @UseGuards(AuthGuard)
    async publishMessage(message: MessageForChat) {
        //TODO : verfiier que le user est bien dans la conv, que le user existe et que la conv aussi
        const messageToDb = await this.conversationService.saveMessage(message);
        return await this.conversationService.updateConversation(
            messageToDb,
            message.conversationId,
        );
    }
}
