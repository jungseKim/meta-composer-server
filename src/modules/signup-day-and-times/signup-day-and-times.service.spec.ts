import { Test, TestingModule } from '@nestjs/testing';
import { SignupDayAndTimesService } from './signup-day-and-times.service';

describe('SignupDayAndTimesService', () => {
  let service: SignupDayAndTimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignupDayAndTimesService],
    }).compile();

    service = module.get<SignupDayAndTimesService>(SignupDayAndTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
