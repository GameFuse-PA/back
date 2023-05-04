import { Module } from '@nestjs/common';
import { ProfilController } from './profile.controller';
import { UsersModule } from '../users/users.module';
import { ProfilService } from './profile.service';
import { JwtModule } from '@nestjs/jwt';
import { AmazonModule } from '../amazon/amazon.module';

@Module({
    imports: [UsersModule, JwtModule, AmazonModule],
    controllers: [ProfilController],
    providers: [ProfilService],
})
export class ProfilModule {}
