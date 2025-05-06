import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { API_URL } from "../../utils/constants"

const initialState = {
  files: [],
  currentFile: null,
  parsedData: null,
  columns: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
}

// Upload file
export const uploadFile = createAsyncThunk("files/upload", async (fileData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.post(`${API_URL}/api/files/upload`, fileData, config)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Get user files
export const getUserFiles = createAsyncThunk("files/getUserFiles", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.get(`${API_URL}/api/files`, config)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Get file by ID
export const getFileById = createAsyncThunk("files/getFileById", async (fileId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.get(`${API_URL}/api/files/${fileId}`, config)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ""
    },
    clearCurrentFile: (state) => {
      state.currentFile = null
      state.parsedData = null
      state.columns = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.files.push(action.payload)
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getUserFiles.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUserFiles.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.files = action.payload
      })
      .addCase(getUserFiles.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getFileById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getFileById.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.currentFile = action.payload.file
        state.parsedData = action.payload.parsedData
        state.columns = action.payload.columns
      })
      .addCase(getFileById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset, clearCurrentFile } = fileSlice.actions
export default fileSlice.reducer
