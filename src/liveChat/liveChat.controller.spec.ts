import { Test, TestingModule } from '@nestjs/testing';
import { LiveChatGateWay } from './liveChatGateWay';

describe('AuthController', () => {
    let controller: LiveChatGateWay;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LiveChatGateWay],
        }).compile();

        controller = module.get<LiveChatGateWay>(LiveChatGateWay);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
