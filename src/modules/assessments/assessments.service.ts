import { Injectable } from '@nestjs/common'
import { CreateAssessmentDto } from './dto/create-star.dto'
import { UpdateAssessmentDto } from './dto/update-star.dto'

@Injectable()
export class AssessmentsService {
  create(createStarDto: CreateAssessmentDto) {
    return 'This action adds a new star'
  }

  findAll() {
    return `This action returns all stars`
  }

  findOne(id: number) {
    return `This action returns a #${id} star`
  }

  update(id: number, updateStarDto: UpdateAssessmentDto) {
    return `This action updates a #${id} star`
  }

  remove(id: number) {
    return `This action removes a #${id} star`
  }
}
