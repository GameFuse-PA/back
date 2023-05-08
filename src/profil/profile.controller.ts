import {
    Controller,
    UseGuards,
    Request,
    Put,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    Get,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ProfilService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilDto } from './dto/profil.dto';
import { PasswordDto } from './dto/password.dto';

@Controller('me')
export class ProfilController {
    constructor(private profileService: ProfilService) {}

    @UseGuards(AuthGuard)
    @Get()
    async getProfile(@Request() req) {
        return this.profileService.getProfil(req.userId);
    }

    @UseGuards(AuthGuard)
    @Put()
    async updateProfile(@Request() req, @Body() body: ProfilDto) {
        return this.profileService.updateProfil(req.userId, body);
    }

    @UseGuards(AuthGuard)
    @Put('password')
    async updatePassword(@Request() req, @Body() body: PasswordDto) {
        return this.profileService.updatePassword(req.userId, body);
    }

    @Post('photo')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadPhoto(
        @Request() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.profileService.uploadPhoto(req.userId, file);
    }
}
