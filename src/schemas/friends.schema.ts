import { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

export type FriendDocument = HydratedDocument<any>;

export class Friends {
    @Prop({ required: true })
    idUSer: string;

    @Prop({ required: true })
    idFriend: string;
}

export const FriendsSchema = SchemaFactory.createForClass(Friends);
