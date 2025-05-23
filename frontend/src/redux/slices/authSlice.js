import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"
import toast from "react-hot-toast"

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
  user: user ? user : null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
}

// Register user
export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    const response = await api.post("/api/users/register", userData)
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data))
      toast.success("Registration successful!")
    }
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    toast.error(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// Login user
export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
  try {
    const response = await api.post("/api/users/login", userData)
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data))
      toast.success("Login successful!")
    }
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    toast.error(message)
    return thunkAPI.rejectWithValue(message)
  }
})

// Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user")
  toast.success("Logged out successfully")
})

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer
