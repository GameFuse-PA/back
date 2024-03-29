import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Request,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../guards/auth.guard';
import { AddGameDto } from './dto/addGame.dto';
import { UpdateGameDto } from './dto/updateGame.dto';

@Controller('games')
export class GamesController {
    constructor(private gamesService: GamesService) {}

    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'banner', maxCount: 1 },
            { name: 'program', maxCount: 1 },
            { name: 'entry', maxCount: 1 },
        ]),
    )
    async addGame(
        @UploadedFiles()
        files: {
            banner: Express.Multer.File[];
            program: Express.Multer.File[];
            entry: Express.Multer.File[];
        },
        @Body() addGameDto: AddGameDto,
        @Request() req,
    ) {
        if (!files.banner) {
            throw new BadRequestException('Bannière requise');
        }
        if (!files.program) {
            throw new BadRequestException('Fichier source requis');
        }

        let playersEntry = null;

        if (!files.entry) {
            throw new BadRequestException("Fichier d'entrée requis");
        } else {
            playersEntry = await this.gamesService.verifyGameEntry(
                files.entry[0],
            );
            if (!playersEntry) {
                throw new BadRequestException("Fichier d'entrée invalide");
            }
        }

        return this.gamesService.addGame(
            addGameDto,
            files.banner[0],
            files.program[0],
            files.entry[0],
            req.userId,
            playersEntry,
        );
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteGame(@Request() req, @Param('id') gameId: string) {
        const game = await this.gamesService.getGame(gameId);

        if (!game) {
            throw new NotFoundException('Jeu introuvable');
        }

        if (game.createdBy._id.toString() !== req.userId) {
            throw new ForbiddenException('Vous ne pouvez pas supprimer ce jeu');
        }

        return this.gamesService.deleteGame(gameId);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'banner', maxCount: 1 },
            { name: 'program', maxCount: 1 },
            { name: 'entry', maxCount: 1 },
        ]),
    )
    async updateGame(
        @UploadedFiles()
        files: {
            banner: Express.Multer.File[];
            program: Express.Multer.File[];
            entry: Express.Multer.File[];
        },
        @Body() updateGameDto: UpdateGameDto,
        @Request() req,
        @Param('id') gameId: string,
    ) {
        const game = await this.gamesService.getGame(gameId);

        if (!game) {
            throw new NotFoundException('Jeu introuvable');
        }

        if (game.createdBy._id.toString() !== req.userId) {
            throw new ForbiddenException('Vous ne pouvez pas modifier ce jeu');
        }

        let playersEntry = null;

        if (files.entry) {
            playersEntry = await this.gamesService.verifyGameEntry(
                files.entry[0],
            );

            if (!playersEntry) {
                throw new BadRequestException("Fichier d'entrée invalide");
            }
        }

        return this.gamesService.updateGame(
            gameId,
            updateGameDto,
            files.banner ? files.banner[0] : null,
            files.program ? files.program[0] : null,
            files.entry ? files.entry[0] : null,
            playersEntry ? playersEntry : null,
        );
    }

    @Get()
    async getGames(@Query('search') search: string) {
        return this.gamesService.getGames(search);
    }
}
