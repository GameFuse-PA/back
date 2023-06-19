import {
    HydratedDocument,
    Schema as MongooseSchema,
    Document,
    Types,
} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Game } from './game.schema';

export type PartiesDocument = HydratedDocument<Parties>;

@Schema({ versionKey: false, timestamps: true })
export class Parties extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    description: string;

    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
    })
    createdBy: User;

    @Prop({
        required: true,
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
        default: [],
    })
    members: User[];

    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: 'Game',
    })
    game: Game;

    @Prop({
        required: false,
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
    })
    winner: User;
}

export const PartiesSchema = SchemaFactory.createForClass(Parties);
