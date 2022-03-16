import { Test, TestingModule } from '@nestjs/testing';
import { ConcoursSignupsController } from './concours-signups.controller';

describe('ConcoursSignupsController', () => {
  let controller: ConcoursSignupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcoursSignupsController],
    }).compile();

    controller = module.get<ConcoursSignupsController>(ConcoursSignupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
