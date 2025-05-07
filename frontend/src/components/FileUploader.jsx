"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { uploadFile } from "../redux/slices/fileSlice"
import toast from "react-hot-toast"

const FileUploader = () => {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const dispatch = useDispatch()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Check if file is Excel
      const fileExt = selectedFile.name.split(".").pop().toLowerCase()
      if (fileExt !== "xlsx" && fileExt !== "xls") {
        toast.error("Please upload only Excel files (.xlsx or .xls)")
        return
      }

      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      toast.error("Please select a file to upload")
      return
    }

    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      await dispatch(uploadFile(formData)).unwrap()
      setFile(null)
      setFileName("")
    } catch (error) {
      console.error("Upload error:", error)
      // Toast error is handled in the thunk
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Excel File</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Excel File (.xlsx, .xls)</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-7">
                <svg
                  className="w-10 h-10 text-gray-400"
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
                <p className="pt-1 text-sm tracking-wider text-gray-400">
                  {fileName ? fileName : "Drag and drop or click to select"}
                </p>
              </div>
              <input type="file" className="opacity-0" accept=".xlsx,.xls" onChange={handleFileChange} />
            </label>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading || !file}
            className={`px-4 py-2 rounded-md text-white ${
              isUploading || !file ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isUploading ? (
              <div className="flex items-center">
                <div className="loading-spinner mr-2"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              "Upload File"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FileUploader
