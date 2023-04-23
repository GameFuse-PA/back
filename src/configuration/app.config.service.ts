import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get jwtExpiration(): number {
    return this.configService.get<number>('JWT_EXPIRATION');
  }

  get mongoUri(): string {
    return this.configService.get<string>('MONGO_URI');
  }
}
