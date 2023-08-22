import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService extends Redis {
  constructor() {
    super()

    super.on('error', (err) => {
      console.error('Error on Redis')
      console.error(err)
      process.exit(1)
    })

    super.on('connect', () => {
      console.info('Redis connected.')
    })
  }
}
