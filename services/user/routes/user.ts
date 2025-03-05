import { sql } from "@databases/pg";
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.post('/', async (req, res) => {
    try {
      const { name } = req.body as any
      const query = sql`INSERT INTO users(name) VALUES (${name})`
      const user = await fastify.db.query(query)

      return res.status(201).send({
        status: 201,
        message: 'success',
        data: user
      })
    } catch(error) {
      fastify.log.error(error, "error")
      return res.status(500).send({
        status: 500,
        message: 'error',
        data: error
      })
    }
  })

  fastify.get('/', async (req, res) => {
    try {
      const user = await fastify.db.query(sql`SELECT * FROM users`)

      return res.status(200).send({
        status: 200,
        message: 'success',
        data: user
      })
    } catch(error) {
      fastify.log.error(error, "error")
      return res.status(500).send({
        status: 500,
        message: 'error',
        data: error
      })
    }
  })

  fastify.get('/:id', async (req, res) => {
      try {
        const { id } = req.params as any
        const user = await  fastify.db.query(sql`SELECT * FROM users WHERE id = ${id}`)

        return res.status(200).send({
          status: 200,
          message: 'success',
          data: user
        })
      }

    catch(error) {
      fastify.log.error(error, "error")
      return res.status(500).send({
        status: 500,
        message: 'error',
        data: error
      })
    }
  })

  fastify.delete('/:id', async (req, res) => {
      try {
        const { id } = req.params as any
        const user = await fastify.db.query(sql`DELETE FROM users WHERE id = ${id}`)

        return res.status(200).send({
          status: 200,
          message: 'success',
          data: user
        })
      }

    catch(error) {
      fastify.log.error(error, "error")
      return res.status(500).send({
        status: 500,
        message: 'error',
        data: error
      })
    }
  })

  fastify.put('/:id', async (req, res) => {
    try {
      const { id } = req.params as any
      const { name } = req.body as any
      const user = await fastify.db.query(sql`UPDATE users SET name = ${name} WHERE id = ${id}`)

      return res.status(200).send({
        status: 200,
        message: 'success',
        data: user
      })

    }
    catch(error) {
      fastify.log.error(error, "error")
      return res.status(500).send({
        status: 500,
        message: 'error',
        data: error
      })
    }
  })
}
