import { PrismaTestUtils } from './prisma'

module.exports = async () => {
  await PrismaTestUtils.run()
}
