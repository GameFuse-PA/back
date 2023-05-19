import { Injectable } from '@nestjs/common';
import { FileService } from '../amazon/file.service';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument } from '../schemas/game.schema';
import { Model } from 'mongoose';
import { AddGameDto } from './dto/addGame.dto';

@Injectable()
export class GamesService {
    constructor(
        private fileService: FileService,
        @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    ) {}

    async addGame(
        game: AddGameDto,
        banner: Express.Multer.File,
        program: Express.Multer.File,
    ) {
        const bannerFile = await this.fileService.uploadFile(
            banner.buffer,
            `${Date.now()}-${banner.originalname}`,
            `game-banner`,
            banner.mimetype,
        );

        const programFile = await this.fileService.uploadFile(
            program.buffer,
            `${Date.now()}-${program.originalname}`,
            `game-program`,
            program.mimetype,
        );

        const newGame = new this.gameModel({
            name: game.name,
            description: game.description,
            banner: bannerFile,
            program: programFile,
        });

        return await newGame.save();
    }
}
