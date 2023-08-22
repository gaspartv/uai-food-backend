require('dotenv').config({ path: '.env.test' })

const { execSync } = require('child_process')

const commands = [
  'docker-compose -f ./docker-compose.yml up -d postgres-test',
  'npx prisma migrate reset --force',
  'npx prisma migrate dev',
  'jest --config ./test/jest-e2e.json',
  'docker-compose -f ./docker-compose.yml stop postgres-test',
  'docker-compose -f ./docker-compose.yml rm -f postgres-test'
]

commands.forEach((command) => {
  execSync(command, { stdio: 'inherit' })
})
