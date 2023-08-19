import { NotFoundException } from '@nestjs/common'

export const httpResponse = (data: any, method?: string) => {
  if (isNullOrEmpty(data)) {
    throw new NotFoundException('No records found.')
  }

  return {
    statusCode: method === 'POST' ? 201 : 200,
    data,
    timestamp: new Date().toISOString(),
    message: [data?.message || 'success'],
    method
  }
}

const isNullOrEmpty = (data: any): boolean => {
  return data === undefined || data === null || data === ''
}
