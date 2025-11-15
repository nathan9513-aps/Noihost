import { Test, TestingModule } from '@nestjs/testing';
import { CleaningJobsController } from './cleaning-jobs.controller';

describe('CleaningJobsController', () => {
  let controller: CleaningJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CleaningJobsController],
    }).compile();

    controller = module.get<CleaningJobsController>(CleaningJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
