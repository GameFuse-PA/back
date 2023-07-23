import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ActionTypeEnum } from '../runner/enum/action-type.enum';
import { User } from './user.schema';
import { MouseButtonEnum } from '../runner/enum/mouse-button.enum';

export type ActionDocument = HydratedDocument<Action>;

@Schema({ versionKey: false, timestamps: true })
export class Action extends Document {
    @Prop({
        required: true,
        enum: ActionTypeEnum,
    })
    type: ActionTypeEnum;

    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
    })
    player: User;

    @Prop({
        required: false,
    })
    x: number;

    @Prop({
        required: false,
    })
    y: number;

    @Prop({
        required: false,
    })
    key: string;

    @Prop({
        required: false,
    })
    text: string;

    @Prop({
        required: false,
        enum: MouseButtonEnum,
    })
    button: MouseButtonEnum;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
