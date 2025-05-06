"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import FileUploader from "../components/FileUploader"

const UploadFile = () => {
  const navigate = useNavigate()
  const { isSuccess, files } = useSelector((state) => state.files)

  // Redirect to analyze page if file was just uploaded
  React.useEffect(() => {
    if (isSuccess && files.length > 0) {
      const latestFile = files[files.length - 1]
      navigate(`/analyze/${latestFile._id}`)
    }
  }, [isSuccess, files, navigate])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Upload Excel File</h1>
        <p className="text-gray-600 mt-2">Upload your Excel file to analyze data and create interactive charts</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <FileUploader />

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Tips for uploading</h3>
          <ul className="list-disc pl-5 text-blue-700 space-y-1">
            <li>Make sure your Excel file (.xlsx or .xls) is properly formatted</li>
            <li>The first row should contain column headers</li>
            <li>Data should be clean and consistent for best analysis results</li>
            <li>Maximum file size is 10MB</li>
            <li>Numeric data works best for visualization</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UploadFile
