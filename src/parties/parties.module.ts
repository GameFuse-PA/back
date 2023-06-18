import { Module } from '@nestjs/common';
import { PartiesService } from './parties.service';
import { PartiesController } from './parties.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule],
    providers: [PartiesService],
    controllers: [PartiesController],
    exports: [PartiesService],
})
export class PartiesModule {}
