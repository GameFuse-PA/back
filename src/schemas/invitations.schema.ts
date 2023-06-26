import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type InvitationsDocument = HydratedDocument<Invitations>;

@Schema({ versionKey: false, timestamps: true })
export class Invitations extends Document {
    @Prop({ required: true })
    sender: string;

    @Prop({ required: true })
    receiver: string;
}

export const InvitationsSchema = SchemaFactory.createForClass(Invitations);
