const mongoose = require("mongoose")

const fileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    originalName: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    columns: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("File", fileSchema)
