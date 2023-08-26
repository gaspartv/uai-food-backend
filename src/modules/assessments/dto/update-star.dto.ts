import { PartialType } from '@nestjs/swagger'
import { CreateAssessmentDto } from './create-star.dto'

export class UpdateAssessmentDto extends PartialType(CreateAssessmentDto) {}
