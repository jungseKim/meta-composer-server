import { Test, TestingModule } from '@nestjs/testing';
import { SignupDayAndTimesController } from './signup-day-and-times.controller';

describe('SignupDayAndTimesController', () => {
  let controller: SignupDayAndTimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignupDayAndTimesController],
    }).compile();

    controller = module.get<SignupDayAndTimesController>(SignupDayAndTimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
