const asyncHandler = require("express-async-handler")
const Chart = require("../models/chartModel")
const File = require("../models/fileModel")

// @desc    Create a new chart
// @route   POST /api/charts
// @access  Private
const createChart = asyncHandler(async (req, res) => {
  const { fileId, title, chartType, xAxis, yAxis } = req.body

  // Check if file exists
  const file = await File.findById(fileId)
  if (!file) {
    res.status(404)
    throw new Error("File not found")
  }

  // Check if user owns the file
  if (file.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(401)
    throw new Error("Not authorized to create chart for this file")
  }

  // Create chart
  const chart = await Chart.create({
    user: req.user.id,
    file: fileId,
    title,
    chartType,
    xAxis,
    yAxis,
  })

  res.status(201).json(chart)
})

// @desc    Get all user charts
// @route   GET /api/charts
// @access  Private
const getUserCharts = asyncHandler(async (req, res) => {
  const charts = await Chart.find({ user: req.user.id }).sort({ createdAt: -1 }).populate("file", "originalName")

  res.json(charts)
})

// @desc    Get chart by ID
// @route   GET /api/charts/:id
// @access  Private
const getChartById = asyncHandler(async (req, res) => {
  const chart = await Chart.findById(req.params.id).populate("file")

  if (!chart) {
    res.status(404)
    throw new Error("Chart not found")
  }

  // Check if user owns the chart
  if (chart.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(401)
    throw new Error("Not authorized to access this chart")
  }

  res.json(chart)
})

// @desc    Delete chart
// @route   DELETE /api/charts/:id
// @access  Private
const deleteChart = asyncHandler(async (req, res) => {
  const chart = await Chart.findById(req.params.id)

  if (!chart) {
    res.status(404)
    throw new Error("Chart not found")
  }

  // Check if user owns the chart
  if (chart.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(401)
    throw new Error("Not authorized to delete this chart")
  }

  await chart.remove()

  res.json({ message: "Chart removed" })
})

module.exports = {
  createChart,
  getUserCharts,
  getChartById,
  deleteChart,
}
