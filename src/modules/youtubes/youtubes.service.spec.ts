import { Test, TestingModule } from '@nestjs/testing';
import { YoutubesService } from './youtubes.service';

describe('YoutubesService', () => {
  let service: YoutubesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YoutubesService],
    }).compile();

    service = module.get<YoutubesService>(YoutubesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
