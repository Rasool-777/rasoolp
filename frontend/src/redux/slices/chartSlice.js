import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { API_URL } from "../../utils/constants"

const initialState = {
  charts: [],
  currentChart: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
}

// Create chart
export const createChart = createAsyncThunk("charts/create", async (chartData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.post(`${API_URL}/api/charts`, chartData, config)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Get user charts
export const getUserCharts = createAsyncThunk("charts/getUserCharts", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.get(`${API_URL}/api/charts`, config)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Get chart by ID
export const getChartById = createAsyncThunk("charts/getChartById", async (chartId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.get(`${API_URL}/api/charts/${chartId}`, config)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const chartSlice = createSlice({
  name: "charts",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ""
    },
    clearCurrentChart: (state) => {
      state.currentChart = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createChart.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.charts.push(action.payload)
        state.currentChart = action.payload
      })
      .addCase(createChart.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getUserCharts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUserCharts.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.charts = action.payload
      })
      .addCase(getUserCharts.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getChartById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getChartById.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.currentChart = action.payload
      })
      .addCase(getChartById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset, clearCurrentChart } = chartSlice.actions
export default chartSlice.reducer
