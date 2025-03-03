
import { ConnectionPool } from '@databases/pg'
import { PlatformaticApp, PlatformaticServiceConfig } from '@platformatic/service'
import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    platformatic: PlatformaticApp<PlatformaticServiceConfig>
    db: ConnectionPool
  }
}
