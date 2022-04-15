import { Test, TestingModule } from '@nestjs/testing';
import { ViewcountsController } from './viewcounts.controller';

describe('ViewcountsController', () => {
  let controller: ViewcountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewcountsController],
    }).compile();

    controller = module.get<ViewcountsController>(ViewcountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
