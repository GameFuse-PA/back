import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { JwtModule } from '@nestjs/jwt';
import { FriendsModule } from '../friends/friends.module';

@Module({
    providers: [InvitationsService],
    imports: [JwtModule, FriendsModule],
    exports: [InvitationsService],
    controllers: [InvitationsController],
})
export class InvitationsModule {}
