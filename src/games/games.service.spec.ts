import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { GamesModule } from './games.module';
import { SchemasModule } from '../schemas/schemas.module';
import { DatabaseModule } from '../database/database.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from "../users/users.module";
import { FileModule } from "../amazon/file.module";
import { CommonModule } from "../common/common.module";

describe('GamesService', () => {
    let service: GamesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GamesService],
            imports: [
              UsersModule,
              FileModule,
              GamesModule,
                CommonModule,
            ],
        }).compile();

        service = module.get<GamesService>(GamesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
