"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getUserFiles } from "../redux/slices/fileSlice"
import { getUserCharts } from "../redux/slices/chartSlice"

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { files, isLoading: filesLoading } = useSelector((state) => state.files)
  const { charts, isLoading: chartsLoading } = useSelector((state) => state.charts)

  useEffect(() => {
    dispatch(getUserFiles())
    dispatch(getUserCharts())
  }, [dispatch])

  const recentFiles = files.slice(0, 5)
  const recentCharts = charts.slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
        <p className="text-gray-600 mt-2">Upload Excel files, analyze data, and create interactive charts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/upload"
              className="flex items-center justify-center p-4 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
            >
              <div className="text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <span>Upload Excel File</span>
              </div>
            </Link>
            <Link
              to="/history"
              className="flex items-center justify-center p-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
            >
              <div className="text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2"
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
                <span>View Analysis History</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Statistics</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-500 mb-1">Total Files</p>
              <p className="text-2xl font-bold text-blue-700">{filesLoading ? "..." : files.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-500 mb-1">Total Charts</p>
              <p className="text-2xl font-bold text-purple-700">{chartsLoading ? "..." : charts.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Files</h2>
            <Link to="/history" className="text-sm text-indigo-600 hover:text-indigo-800">
              View All
            </Link>
          </div>
          {filesLoading ? (
            <div className="flex justify-center py-8">
              <div className="loading-spinner"></div>
            </div>
          ) : recentFiles.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentFiles.map((file) => (
                <li key={file._id} className="py-3">
                  <Link to={`/analyze/${file._id}`} className="flex items-center hover:bg-gray-50 p-2 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.originalName}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded on {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Analyze
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No files uploaded yet</p>
              <Link to="/upload" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
                Upload your first Excel file
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Charts</h2>
            <Link to="/history" className="text-sm text-indigo-600 hover:text-indigo-800">
              View All
            </Link>
          </div>
          {chartsLoading ? (
            <div className="flex justify-center py-8">
              <div className="loading-spinner"></div>
            </div>
          ) : recentCharts.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentCharts.map((chart) => (
                <li key={chart._id} className="py-3">
                  <div className="flex items-center p-2 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{chart.title}</p>
                      <p className="text-sm text-gray-500">
                        {chart.chartType} chart • Created on {new Date(chart.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No charts created yet</p>
              <p className="mt-2">Upload and analyze data to create charts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
