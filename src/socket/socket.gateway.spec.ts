import { Test, TestingModule } from '@nestjs/testing';
import { SocketGateway } from './socket.gateway';
import { SocketModule } from './socket.module';
import { CommonModule } from '../common/common.module';

describe('SocketGateway', () => {
    let gateway: SocketGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SocketGateway],
            imports: [SocketModule, CommonModule],
        }).compile();

        gateway = module.get<SocketGateway>(SocketGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});
