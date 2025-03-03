import { sql } from "@databases/pg";
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.post('/', async (req, res) => {
    try {
      const { name } = req.body as any
      const user = fastify.db.query(sql`INSERT INTO user (name) VALUES (${name})`)

      return res.status(201).send({
        status: 201,
        message: 'success',
        data: user
      })
    } catch(error) {
      console.error(error)
      return res.status(500).send({
        status: 500,
        message: 'error',
        data: error
      })
    }
  })

  fastify.get('/', async (req, res) => {
    try {
      const user = fastify.db.query(sql`SELECT * FROM user`)

      return res.status(200).send({
        status: 200,
        message: 'success',
        data: user
      })
    } catch(error) {
      console.error(error)
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
        const user = fastify.db.query(sql`SELECT * FROM user WHERE id = ${id}`)

        return res.status(200).send({
          status: 200,
          message: 'success',
          data: user
        })
      }

    catch(error) {
      console.error(error)
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
        const user = fastify.db.query(sql`DELETE FROM user WHERE id = ${id}`)

        return res.status(200).send({
          status: 200,
          message: 'success',
          data: user
        })
      }

    catch(error) {
      console.error(error)
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
      const user = fastify.db.query(sql`UPDATE user SET name = ${name} WHERE id = ${id}`)

      return res.status(200).send({
        status: 200,
        message: 'success',
        data: user
      })

    }
    catch(error) {
      console.error(error)
      return res.status(500).send({
        status: 500,
        message: 'error',
        data: error
      })
    }
  })
}
