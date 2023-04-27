import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

export type FriendDocument = HydratedDocument<Friends>;

@Schema({ versionKey: false })
export class Friends {
    @Prop({ required: true })
    idUSer: string;

    @Prop({
        required: true,
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    })
    idFriend: Types.ObjectId[];
}

export const FriendsSchema = SchemaFactory.createForClass(Friends);
