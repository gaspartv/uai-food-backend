import { Test, TestingModule } from '@nestjs/testing'
import { AssessmentsService } from './assessments.service'

describe('StarsService', () => {
  let service: AssessmentsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentsService]
    }).compile()

    service = module.get<AssessmentsService>(AssessmentsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
