const asyncHandler = require("express-async-handler")
const fs = require("fs")
const path = require("path")
const xlsx = require("xlsx")
const File = require("../models/fileModel")

// @desc    Upload a file
// @route   POST /api/files/upload
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error("Please upload a file")
  }

  // Check if file is Excel
  const fileExt = path.extname(req.file.originalname).toLowerCase()
  if (fileExt !== ".xlsx" && fileExt !== ".xls") {
    // Remove the uploaded file
    fs.unlinkSync(req.file.path)
    res.status(400)
    throw new Error("Please upload an Excel file")
  }

  try {
    // Parse Excel file to get columns
    const workbook = xlsx.readFile(req.file.path)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(worksheet)

    if (data.length === 0) {
      // Remove the uploaded file
      fs.unlinkSync(req.file.path)
      res.status(400)
      throw new Error("Excel file is empty")
    }

    // Get column headers
    const columns = Object.keys(data[0])

    // Create file record
    const file = await File.create({
      user: req.user.id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      size: req.file.size,
      columns,
    })

    res.status(201).json(file)
  } catch (error) {
    // Remove the uploaded file
    fs.unlinkSync(req.file.path)
    res.status(500)
    throw new Error("Error processing Excel file: " + error.message)
  }
})

// @desc    Get all user files
// @route   GET /api/files
// @access  Private
const getUserFiles = asyncHandler(async (req, res) => {
  const files = await File.find({ user: req.user.id }).sort({ createdAt: -1 })
  res.json(files)
})

// @desc    Get file by ID
// @route   GET /api/files/:id
// @access  Private
const getFileById = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id)

  if (!file) {
    res.status(404)
    throw new Error("File not found")
  }

  // Check if user owns the file
  if (file.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(401)
    throw new Error("Not authorized to access this file")
  }

  // Parse Excel file
  const workbook = xlsx.readFile(file.filePath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const parsedData = xlsx.utils.sheet_to_json(worksheet)

  res.json({
    file,
    parsedData,
    columns: file.columns,
  })
})

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id)

  if (!file) {
    res.status(404)
    throw new Error("File not found")
  }

  // Check if user owns the file
  if (file.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(401)
    throw new Error("Not authorized to delete this file")
  }

  // Delete file from filesystem
  fs.unlinkSync(file.filePath)

  // Delete file from database
  await file.remove()

  res.json({ message: "File removed" })
})

module.exports = {
  uploadFile,
  getUserFiles,
  getFileById,
  deleteFile,
}
