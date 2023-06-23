import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ versionKey: false })
export class Room {
    @Prop({
        required: true,
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
        default: [],
    })
    idUsers: Types.ObjectId[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
