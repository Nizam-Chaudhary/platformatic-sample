import createConnectionPool from '@databases/pg';
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";


export default fastifyPlugin(async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  try {
    const db = createConnectionPool(
        'postgresql://postgres:postgres@localhost:5432/test-db',
      );
    fastify.decorate('db', db);
  } catch (error) {
    console.error('Error connecting to database:', error);
    // process.exit(1);
  }
})
