const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const colors = require("colors")
const morgan = require("morgan")
const path = require("path")
const connectDB = require("./config/db")
const { errorHandler } = require("./middleware/errorMiddleware")

// Load env vars
dotenv.config()

// Connect to database
connectDB()

// Route files
const userRoutes = require("./routes/userRoutes")
const fileRoutes = require("./routes/fileRoutes")
const chartRoutes = require("./routes/chartRoutes")
const adminRoutes = require("./routes/adminRoutes")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Set static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Mount routes
app.use("/api/users", userRoutes)
app.use("/api/files", fileRoutes)
app.use("/api/charts", chartRoutes)
app.use("/api/admin", adminRoutes)

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close server & exit process
  // server.close(() => process.exit(1));
})
