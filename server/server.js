const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config()
connectDB()
const app = express()
 app.use(express.json())
app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use(notFound)
app.use(errorHandler)
const port = process.env.PORT
app.listen(port , console.log(`server start ${port}`))