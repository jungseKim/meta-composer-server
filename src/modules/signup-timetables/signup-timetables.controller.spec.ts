import { Test, TestingModule } from '@nestjs/testing';
import { SignupTimetablesController } from './signup-timetables.controller';

describe('SignupTimetablesController', () => {
  let controller: SignupTimetablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignupTimetablesController],
    }).compile();

    controller = module.get<SignupTimetablesController>(SignupTimetablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
