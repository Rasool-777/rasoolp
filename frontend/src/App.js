import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import { Toaster } from "react-hot-toast"

// Pages
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import UploadFile from "./pages/UploadFile"
import AnalyzeData from "./pages/AnalyzeData"
import ViewHistory from "./pages/ViewHistory"
import AdminDashboard from "./pages/AdminDashboard"
import NotFound from "./pages/NotFound"

// Components
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"
import Navbar from "./components/Navbar"

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/upload"
              element={
                <PrivateRoute>
                  <UploadFile />
                </PrivateRoute>
              }
            />

            <Route
              path="/analyze/:fileId"
              element={
                <PrivateRoute>
                  <AnalyzeData />
                </PrivateRoute>
              }
            />

            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <ViewHistory />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App
