const express = require("express")
const router = express.Router()
const { uploadFile, getUserFiles, getFileById, deleteFile } = require("../controllers/fileController")
const { protect } = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware")

router.route("/").get(protect, getUserFiles)
router.route("/upload").post(protect, upload.single("file"), uploadFile)
router.route("/:id").get(protect, getFileById).delete(protect, deleteFile)

module.exports = router
