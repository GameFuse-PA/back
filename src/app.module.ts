import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { SchemasModule } from './schemas/schemas.module';
import { DatabaseModule } from './database/database.module';
import { ProfilModule } from './profil/profil.module';
import { AmazonModule } from './amazon/amazon.module';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        ConfigurationModule,
        SchemasModule,
        DatabaseModule,
        ProfilModule,
        AmazonModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
