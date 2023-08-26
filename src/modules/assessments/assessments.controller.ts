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
import { CreateAssessmentDto } from './dto/create-star.dto'
import { UpdateAssessmentDto } from './dto/update-star.dto'

@Controller('stars')
export class AssessmentsController {
  constructor(private readonly starsService: AssessmentsService) {}

  @Post()
  create(@Body() createStarDto: CreateAssessmentDto) {
    return this.starsService.create(createStarDto)
  }

  @Get()
  findAll() {
    return this.starsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.starsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStarDto: UpdateAssessmentDto) {
    return this.starsService.update(+id, updateStarDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.starsService.remove(+id)
  }
}
