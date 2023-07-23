import {
    HydratedDocument,
    Schema as MongooseSchema,
    Document,
    Types,
} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GameSessionStatus } from '../game-session/enum/game-session.enum';
import { Game } from './game.schema';
import { Action } from './action.schema';
import { User } from './user.schema';

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
    players: User[];

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

    @Prop({
        required: true,
        enum: GameSessionStatus,
        default: GameSessionStatus.In_Progress,
    })
    status: GameSessionStatus;

    @Prop({
        required: false,
        type: MongooseSchema.Types.ObjectId,
        ref: 'Conversation',
    })
    conversation: Types.ObjectId;

    @Prop({
        required: true,
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Action' }],
        default: [],
    })
    actions: Action[];
}

export const GameSessionsSchema = SchemaFactory.createForClass(GameSessions);
