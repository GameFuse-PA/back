import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {HydratedDocument, ObjectId} from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ versionKey: false })
export class Message {
    @Prop({ required: true, unique: true })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    senderId: mongoose.Types.ObjectId;


    @Prop({ required: true, select: false })
    date: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    conversationId: mongoose.Types.ObjectId;

}

export const MessageSchema = SchemaFactory.createForClass(Message);
