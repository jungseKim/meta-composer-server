import { Test, TestingModule } from '@nestjs/testing';
import { SearchHistoriesService } from './search-histories.service';

describe('SearchHistoriesService', () => {
  let service: SearchHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchHistoriesService],
    }).compile();

    service = module.get<SearchHistoriesService>(SearchHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
