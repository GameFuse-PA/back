import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { FriendsModule } from './modules/friends.module';

@Module({
    imports: [FriendsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
