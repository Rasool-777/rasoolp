"use client"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/slices/authSlice"

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Excel Analytics</span>
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                  Dashboard
                </Link>
                <Link to="/upload" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                  Upload
                </Link>
                <Link to="/history" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                  History
                </Link>
                {user.isAdmin && (
                  <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                    Admin
                  </Link>
                )}
                <button
                  onClick={onLogout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-white text-indigo-600 hover:bg-gray-100"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
