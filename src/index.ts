import bootstrapApp from './app'
import logger from './utilities/logger'

const runApp = async () => {
  try {
    const PORT = process.env.PORT || 3000

    const app = await bootstrapApp()
  
    app.listen(PORT, () => logger.debug(`App running on PORT: ${PORT}`))
  
    return app
  
  } catch(error) {
    logger.error(`Unable to run app: ${error}`)
  }
}

( async () => await runApp() )()