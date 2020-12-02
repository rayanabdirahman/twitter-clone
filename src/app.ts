import express from 'express'
import logger from './utilities/logger'

export default async (): Promise<express.Application> => (
  new Promise<express.Application>(async (resolve, reject) => {
    try {
      const app = express()

      // set middleware
      app.use(express.json())
      app.use(express.urlencoded({ extended: false }))

      // test api route
      app.get('/api/', async (req: express.Request, res: express.Response): Promise<express.Response> => {
        return res.json({ 'Mainstreet API': 'Version 1' })
      })

      resolve(app)
      
    } catch (error) {
      logger.error(`Error when bootstrapping app: ${error}`)
      reject(error)
    }
  })
)
