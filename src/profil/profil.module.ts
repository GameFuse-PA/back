import { Module } from '@nestjs/common';
import { ProfilController } from './profile.controller';
import { UsersModule } from '../users/users.module';
import { ProfilService } from './profile.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [UsersModule, JwtModule],
    controllers: [ProfilController],
    providers: [ProfilService],
})
export class ProfilModule {}
