import { Test, TestingModule } from '@nestjs/testing';
import { SignupsController } from './signups.controller';

describe('SignupsController', () => {
  let controller: SignupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignupsController],
    }).compile();

    controller = module.get<SignupsController>(SignupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
