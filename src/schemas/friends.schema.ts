import { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

export type FriendDocument = HydratedDocument<Friends>;

@Schema({ versionKey: false })
export class Friends {
    @Prop({ required: true })
    idUSer: string;

    @Prop({ required: true })
    idFriend: string;
}

export const FriendsSchema = SchemaFactory.createForClass(Friends);
