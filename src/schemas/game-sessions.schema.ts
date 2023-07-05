import {
    HydratedDocument,
    Schema as MongooseSchema,
    Document,
    Types,
} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GameSessionStatus } from '../game-session/enum/game-session.enum';

export type GameSessionsDocument = HydratedDocument<GameSessions>;

@Schema({ versionKey: false, timestamps: true })
export class GameSessions extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
    })
    createdBy: Types.ObjectId;

    @Prop({
        required: true,
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
        default: [],
    })
    players: Types.ObjectId[];

    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: 'Game',
    })
    game: Types.ObjectId;

    @Prop({
        required: true,
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Message' }],
        default: [],
    })
    messages: Types.ObjectId[];

    @Prop({
        required: false,
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
    })
    winner: Types.ObjectId;

    @Prop({
        required: true,
        enum: GameSessionStatus,
        default: GameSessionStatus.In_Progress,
    })
    status: GameSessionStatus;
}

export const GameSessionsSchema = SchemaFactory.createForClass(GameSessions);
