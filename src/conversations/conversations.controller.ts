import { Controller, Put, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { AuthGuard } from '../guards/auth.guard';
import { MessageForChat } from '../liveChat/Models/MessageForChat';

@Controller('conversations')
export class ConversationsController {}
