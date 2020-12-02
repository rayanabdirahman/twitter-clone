import mongoose from 'mongoose'
import logger from '../utilities/logger'

const MONGO_URI = `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.llymp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const connectToDbClient = async (uri: string = MONGO_URI): Promise<void> => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })

    logger.info(`Successfully connected to database ✅`)

  } catch(error) {
    logger.error(`Failed to connect to database 🛑 : ${error}`)
  }
}

export default connectToDbClient
