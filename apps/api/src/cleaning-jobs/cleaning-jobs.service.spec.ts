import { Test, TestingModule } from '@nestjs/testing';
import { CleaningJobsService } from './cleaning-jobs.service';

describe('CleaningJobsService', () => {
  let service: CleaningJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CleaningJobsService],
    }).compile();

    service = module.get<CleaningJobsService>(CleaningJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
