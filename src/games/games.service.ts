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
        const bannerUrl = await this.fileService.uploadFile(
            banner.buffer,
            `game-banner/${Date.now()}-${banner.originalname}`,
        );
        const programUrl = await this.fileService.uploadFile(
            program.buffer,
            `game-program/${Date.now()}-${program.originalname}`,
        );
        const newGame = new this.gameModel({
            name: game.name,
            description: game.description,
            banner: bannerUrl,
            program: programUrl,
        });
        return await newGame.save();
    }
}
