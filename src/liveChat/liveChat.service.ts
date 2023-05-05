import { Injectable } from '@nestjs/common';
import { MessageDTO } from './MessageDTO';

@Injectable()
export class LiveChatService {
    async postMessage(content: MessageDTO) {
        //post du message dans la conv
    }
}
