import { Injectable } from '@nestjs/common';
import { MessageForDb } from './Models/MessageForDb';

@Injectable()
export class LiveChatService {
    async postMessage(content: MessageForDb) {
        //post du message dans la conv
    }
}
