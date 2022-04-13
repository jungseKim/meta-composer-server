import { Test, TestingModule } from '@nestjs/testing';
import { ViewcountsService } from './viewcounts.service';

describe('ViewcountsService', () => {
  let service: ViewcountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewcountsService],
    }).compile();

    service = module.get<ViewcountsService>(ViewcountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
