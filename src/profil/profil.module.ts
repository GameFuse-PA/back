import { Module } from '@nestjs/common';
import { ProfilController } from './profile.controller';
import { UsersModule } from '../users/users.module';
import { ProfilService } from './profile.service';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from '../amazon/file.module';
import { FriendsModule } from '../friends/friends.module';

@Module({
    imports: [UsersModule, JwtModule, FileModule, FriendsModule],
    controllers: [ProfilController],
    providers: [ProfilService],
})
export class ProfilModule {}
