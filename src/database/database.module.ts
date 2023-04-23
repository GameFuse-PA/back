import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from '../configuration/app.config.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        uri: appConfigService.mongoUri,
      }),
    }),
  ],
})
export class DatabaseModule {}
