"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getUserFiles } from "../redux/slices/fileSlice"
import { getUserCharts } from "../redux/slices/chartSlice"

const ViewHistory = () => {
  const dispatch = useDispatch()
  const { files, isLoading: filesLoading } = useSelector((state) => state.files)
  const { charts, isLoading: chartsLoading } = useSelector((state) => state.charts)

  const [activeTab, setActiveTab] = useState("files")

  useEffect(() => {
    dispatch(getUserFiles())
    dispatch(getUserCharts())
  }, [dispatch])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Analysis History</h1>
        <p className="text-gray-600 mt-2">View your uploaded files and created charts</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("files")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "files"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Uploaded Files
            </button>
            <button
              onClick={() => setActiveTab("charts")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "charts"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Created Charts
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "files" && (
            <>
              {filesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="loading-spinner"></div>
                </div>
              ) : files.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          File Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Upload Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Size
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {files.map((file) => (
                        <tr key={file._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {file.originalName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(file.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {Math.round(file.size / 1024)} KB
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link to={`/analyze/${file._id}`} className="text-indigo-600 hover:text-indigo-900">
                              Analyze
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No files uploaded yet</p>
                  <Link to="/upload" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
                    Upload your first Excel file
                  </Link>
                </div>
              )}
            </>
          )}

          {activeTab === "charts" && (
            <>
              {chartsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="loading-spinner"></div>
                </div>
              ) : charts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {charts.map((chart) => (
                    <div key={chart._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-2">{chart.title}</h3>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>Type: {chart.chartType}</p>
                        <p>X-Axis: {chart.xAxis}</p>
                        <p>Y-Axis: {chart.yAxis}</p>
                        <p>Created: {new Date(chart.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No charts created yet</p>
                  <p className="mt-2">Upload and analyze data to create charts</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewHistory
