const express = require("express")
const router = express.Router()
const { createChart, getUserCharts, getChartById, deleteChart } = require("../controllers/chartController")
const { protect } = require("../middleware/authMiddleware")

router.route("/").post(protect, createChart).get(protect, getUserCharts)
router.route("/:id").get(protect, getChartById).delete(protect, deleteChart)

module.exports = router
