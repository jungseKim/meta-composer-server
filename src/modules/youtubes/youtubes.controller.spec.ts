import { Test, TestingModule } from "@nestjs/testing";
import { YoutubesController } from "./youtubes.controller";

describe("YoutubesController", () => {
  let controller: YoutubesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YoutubesController],
    }).compile();

    controller = module.get<YoutubesController>(YoutubesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
