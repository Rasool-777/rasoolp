export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

export const CHART_TYPES = {
  "2d-bar": { label: "Bar Chart", dimension: "2D" },
  "2d-line": { label: "Line Chart", dimension: "2D" },
  "2d-pie": { label: "Pie Chart", dimension: "2D" },
  "2d-scatter": { label: "Scatter Plot", dimension: "2D" },
  "3d-column": { label: "3D Column Chart", dimension: "3D" },
}
