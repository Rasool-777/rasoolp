const express = require("express")
const router = express.Router()
const { getUsers, getStats } = require("../controllers/adminController")
const { protect, admin } = require("../middleware/authMiddleware")

router.route("/users").get(protect, admin, getUsers)
router.route("/stats").get(protect, admin, getStats)

module.exports = router
