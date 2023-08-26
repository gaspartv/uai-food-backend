import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { AssessmentsService } from './assessments.service'
import { CreateAssessmentDto } from './dto/create-assessment.dto'
import { UpdateAssessmentDto } from './dto/update-assessment.dto'

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  create(@Body() dto: CreateAssessmentDto) {
    return this.assessmentsService.create(dto)
  }

  @Get()
  findAll() {
    return this.assessmentsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAssessmentDto) {
    return this.assessmentsService.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assessmentsService.remove(+id)
  }
}
