import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import {Message, MessageSchema} from "./message.schema";
import {Conversation, ConversationSchema} from "./conversation.schema";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
        MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),
    ],
    exports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
        MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),
    ],
})
export class SchemasModule {}
