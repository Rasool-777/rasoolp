"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getFileById, clearCurrentFile } from "../redux/slices/fileSlice"
import { createChart } from "../redux/slices/chartSlice"
import ChartRenderer from "../components/ChartRenderer"
import ThreeJsRenderer from "../components/ThreeJsRenderer"
import toast from "react-hot-toast"

const AnalyzeData = () => {
  const { fileId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentFile, parsedData, columns, isLoading } = useSelector((state) => state.files)

  const [chartConfig, setChartConfig] = useState({
    xAxis: "",
    yAxis: "",
    chartType: "2d-bar",
    title: "",
  })

  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    dispatch(getFileById(fileId))

    return () => {
      dispatch(clearCurrentFile())
    }
  }, [dispatch, fileId])

  useEffect(() => {
    if (columns && columns.length > 0) {
      setChartConfig((prev) => ({
        ...prev,
        xAxis: columns[0],
        yAxis: columns.length > 1 ? columns[1] : columns[0],
      }))
    }
  }, [columns])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setChartConfig({
      ...chartConfig,
      [name]: value,
    })
  }

  const handlePreview = () => {
    if (!chartConfig.xAxis || !chartConfig.yAxis) {
      toast.error("Please select both X and Y axes")
      return
    }
    setShowPreview(true)
  }

  const handleSaveChart = async () => {
    if (!chartConfig.title) {
      toast.error("Please enter a title for your chart")
      return
    }

    try {
      await dispatch(
        createChart({
          fileId,
          ...chartConfig,
        }),
      ).unwrap()

      toast.success("Chart saved successfully")
      navigate("/history")
    } catch (error) {
      toast.error("Failed to save chart")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!currentFile || !parsedData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">File not found</h1>
        <p className="mt-2">The requested file could not be loaded</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Analyze Data</h1>
        <p className="text-gray-600 mt-2">File: {currentFile.originalName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Chart Configuration</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chart Title</label>
              <input
                type="text"
                name="title"
                value={chartConfig.title}
                onChange={handleInputChange}
                placeholder="Enter chart title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
              <select
                name="chartType"
                value={chartConfig.chartType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="2d-bar">Bar Chart</option>
                <option value="2d-line">Line Chart</option>
                <option value="2d-pie">Pie Chart</option>
                <option value="2d-scatter">Scatter Plot</option>
                <option value="3d-column">3D Column Chart</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">X-Axis (Categories)</label>
              <select
                name="xAxis"
                value={chartConfig.xAxis}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Y-Axis (Values)</label>
              <select
                name="yAxis"
                value={chartConfig.yAxis}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex space-x-2">
              <button
                onClick={handlePreview}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Preview Chart
              </button>
              <button
                onClick={handleSaveChart}
                disabled={!showPreview}
                className={`flex-1 px-4 py-2 rounded ${
                  showPreview
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Save Chart
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {showPreview ? (
            <div className="space-y-6">
              {chartConfig.chartType.startsWith("2d") ? (
                <ChartRenderer
                  data={parsedData}
                  xAxis={chartConfig.xAxis}
                  yAxis={chartConfig.yAxis}
                  chartType={chartConfig.chartType.split("-")[1]}
                  title={chartConfig.title || `${chartConfig.yAxis} vs ${chartConfig.xAxis}`}
                />
              ) : (
                <ThreeJsRenderer
                  data={parsedData}
                  xAxis={chartConfig.xAxis}
                  yAxis={chartConfig.yAxis}
                  title={chartConfig.title || `3D Visualization: ${chartConfig.yAxis} by ${chartConfig.xAxis}`}
                />
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                <h3 className="text-lg font-medium">Chart Preview</h3>
                <p className="mt-2">Configure your chart settings and click "Preview Chart" to see the visualization</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Data Preview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parsedData.slice(0, 10).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={`${rowIndex}-${column}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {parsedData.length > 10 && (
            <div className="text-center text-gray-500 text-sm mt-2">Showing 10 of {parsedData.length} rows</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyzeData
