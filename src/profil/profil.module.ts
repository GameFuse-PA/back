import { Module } from '@nestjs/common';
import { ProfilController } from './profile.controller';
import { UsersModule } from '../users/users.module';
import { ProfilService } from './profile.service';

@Module({
    imports: [UsersModule],
    controllers: [ProfilController],
    providers: [ProfilService],
})
export class ProfilModule {}
