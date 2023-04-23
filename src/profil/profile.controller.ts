import { Controller, Post, UseGuards, Request, Put } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ProfilService } from './profile.service';

@Controller('me')
export class ProfilController {
    constructor(private profileService: ProfilService) {}
    @UseGuards(AuthGuard)
    async updateProfile(@Request() req) {
        return this.profileService.updateProfil(req.userId, req.body);
    }
}
