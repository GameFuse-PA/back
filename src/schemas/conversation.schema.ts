import { MessageDto } from '../conversations/dto/message.dto';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import {
    Document,
    HydratedDocument,
    Schema as MongooseSchema,
    Types,
} from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

export class Conversation extends Document {
    @Prop({
        required: true,
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    })
    users: Types.ObjectId[];

    @Prop({
        required: true,
        type: [{ type: MessageDto }],
        default: [],
    })
    messages: MessageDto[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
