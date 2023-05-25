import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Request,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../guards/auth.guard';
import { AddGameDto } from './dto/addGame.dto';

@Controller('games')
export class GamesController {
    constructor(private gamesService: GamesService) {}

    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'banner', maxCount: 1 },
            { name: 'program', maxCount: 1 },
        ]),
    )
    addGame(
        @UploadedFiles()
        files: {
            banner: Express.Multer.File[];
            program: Express.Multer.File[];
        },
        @Body() addGameDto: AddGameDto,
        @Request() req,
    ) {
        if (!files.banner) {
            throw new BadRequestException('Bannière requise');
        }
        if (!files.program) {
            throw new BadRequestException('Fichier du jeu requis');
        }
        return this.gamesService.addGame(
            addGameDto,
            files.banner[0],
            files.program[0],
            req.userId,
        );
    }
}
