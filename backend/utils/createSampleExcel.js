const xlsx = require("xlsx")
const fs = require("fs")
const path = require("path")

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "..", "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Sample data
const data = [
  { Month: "January", Sales: 1000, Expenses: 700, Profit: 300 },
  { Month: "February", Sales: 1200, Expenses: 800, Profit: 400 },
  { Month: "March", Sales: 900, Expenses: 600, Profit: 300 },
  { Month: "April", Sales: 1500, Expenses: 900, Profit: 600 },
  { Month: "May", Sales: 1800, Expenses: 1000, Profit: 800 },
  { Month: "June", Sales: 2000, Expenses: 1200, Profit: 800 },
]

// Create a new workbook
const workbook = xlsx.utils.book_new()

// Convert data to worksheet
const worksheet = xlsx.utils.json_to_sheet(data)

// Add the worksheet to the workbook
xlsx.utils.book_append_sheet(workbook, worksheet, "Sales Data")

// Write the workbook to a file
const filePath = path.join(uploadsDir, "sample_data.xlsx")
xlsx.writeFile(workbook, filePath)

console.log(`Sample Excel file created at: ${filePath}`)
