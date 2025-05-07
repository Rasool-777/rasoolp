const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const colors = require("colors")
const User = require("../models/userModel")

// Load env vars
dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected".cyan.underline)
    createAdmin()
  })
  .catch((err) => {
    console.error(`Error: ${err.message}`.red.underline.bold)
    process.exit(1)
  })

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@example.com" })

    if (adminExists) {
      console.log("Admin user already exists".yellow)
      process.exit(0)
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("admin123", salt)

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
    })

    console.log("Admin user created:".green)
    console.log({
      name: admin.name,
      email: admin.email,
      isAdmin: admin.isAdmin,
    })

    console.log("\nLogin credentials:".cyan)
    console.log("Email: admin@example.com")
    console.log("Password: admin123")

    process.exit(0)
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold)
    process.exit(1)
  }
}
