import { Test, TestingModule } from '@nestjs/testing';
import { SignupTimetablesService } from './signup-timetables.service';

describe('SignupTimetablesService', () => {
  let service: SignupTimetablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignupTimetablesService],
    }).compile();

    service = module.get<SignupTimetablesService>(SignupTimetablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
