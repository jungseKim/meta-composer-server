import { Test, TestingModule } from '@nestjs/testing';
import { ConcoursSignupsService } from './concours-signups.service';

describe('ConcoursSignupsService', () => {
  let service: ConcoursSignupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConcoursSignupsService],
    }).compile();

    service = module.get<ConcoursSignupsService>(ConcoursSignupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
