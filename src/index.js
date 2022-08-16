import express from 'express'

const app = express()
const PORT = 4000

app.get('/', async (_req, res) => {
  return res.status(200).send({
    message: 'Hello World!!',
  })
})

app.listen(PORT, () => {
  console.log(`dev server running at: http://localhost:${PORT}/`)
})
