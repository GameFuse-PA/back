import { Injectable } from '@nestjs/common';
import { FileService } from '../amazon/file.service';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument } from '../schemas/game.schema';
import { Model } from 'mongoose';
import { AddGameDto } from './dto/addGame.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class GamesService {
    constructor(
        private fileService: FileService,
        private userService: UsersService,
        @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    ) {}

    async addGame(
        game: AddGameDto,
        banner: Express.Multer.File,
        program: Express.Multer.File,
        userId: string,
    ) {
        const user = await this.userService.findOneById(userId);

        const bannerFile = await this.fileService.uploadFile(
            banner.buffer,
            `${Date.now()}.${banner.mimetype.split('/')[1]}}`,
            `game-banner`,
            banner.mimetype,
        );

        const programFile = await this.fileService.uploadFile(
            program.buffer,
            `${Date.now()}.${banner.mimetype.split('/')[1]}}`,
            `game-program`,
            program.mimetype,
        );

        const newGame = new this.gameModel({
            name: game.name,
            description: game.description,
            banner: bannerFile,
            program: programFile,
            createdBy: user,
        });

        return await newGame.save();
    }

    async getUserGames(userId: string) {
        return await this.gameModel
            .find({ createdBy: userId })
            .populate('banner')
            .populate('program')
            .populate('createdBy')
            .exec();
    }
}
