import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { File, FileSchema } from './file.schema';
import { Game, GameSchema } from './game.schema';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    ],
    exports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    ],
})
export class SchemasModule {}
