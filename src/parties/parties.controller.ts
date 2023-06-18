import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { PartiesService } from './parties.service';
import { PartyDto } from './dto/party.dto';

@Controller('parties')
export class PartiesController {
    constructor(private partiesService: PartiesService) {}

    @UseGuards(AuthGuard)
    @Post()
    createParty(@Request() req, @Body() body: PartyDto) {
        return this.partiesService.createParty(body);
    }
}
