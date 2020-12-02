require('dotenv').config()

import bootstrapApp from './app'
import connectToDbClient from './database/db_client'
import logger from './utilities/logger'

const runApp = async () => {
  try {
    const PORT = process.env.PORT || 3000

    // connect to database
    await connectToDbClient()

    const app = await bootstrapApp()
  
    app.listen(PORT, () => logger.debug(`App running on PORT: ${PORT}`))
  
    return app
  
  } catch(error) {
    logger.error(`Unable to run app: ${error}`)
  }
}

( async () => await runApp() )()