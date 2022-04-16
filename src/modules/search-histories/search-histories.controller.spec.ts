import { Test, TestingModule } from '@nestjs/testing';
import { SearchHistoriesController } from './search-histories.controller';

describe('SearchHistoriesController', () => {
  let controller: SearchHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchHistoriesController],
    }).compile();

    controller = module.get<SearchHistoriesController>(SearchHistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
