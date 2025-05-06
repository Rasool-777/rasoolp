const mongoose = require("mongoose")

const chartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    file: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "File",
    },
    title: {
      type: String,
      required: true,
    },
    chartType: {
      type: String,
      required: true,
      enum: ["2d-bar", "2d-line", "2d-pie", "2d-scatter", "3d-column"],
    },
    xAxis: {
      type: String,
      required: true,
    },
    yAxis: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Chart", chartSchema)
