import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument, ObjectId} from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ versionKey: false })
export class Conversation {
    @Prop({ required: true, unique: true })
    messages: ObjectId[] | null;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
