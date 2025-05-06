const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const File = require("../models/fileModel")
const Chart = require("../models/chartModel")
const mongoose = require("mongoose")

// @desc    Get all users with file and chart counts
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  // Aggregate to get file and chart counts for each user
  const usersWithCounts = await User.aggregate([
    {
      $lookup: {
        from: "files",
        localField: "_id",
        foreignField: "user",
        as: "files",
      },
    },
    {
      $lookup: {
        from: "charts",
        localField: "_id",
        foreignField: "user",
        as: "charts",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        isAdmin: 1,
        createdAt: 1,
        fileCount: { $size: "$files" },
        chartCount: { $size: "$charts" },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ])

  res.json(usersWithCounts)
})

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments()
  const totalFiles = await File.countDocuments()
  const totalCharts = await Chart.countDocuments()

  // Calculate total storage used
  const files = await File.find({}, "size")
  const storageUsed = files.reduce((total, file) => total + file.size, 0)

  res.json({
    totalUsers,
    totalFiles,
    totalCharts,
    storageUsed,
  })
})

module.exports = {
  getUsers,
  getStats,
}
