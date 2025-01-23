import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, redirect } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import toast, { Toaster } from "react-hot-toast";
import { removeUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/logout",
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeUser());
      toast.success(response.data, {
        style: {
          background: "black",
          color: "#fff",
        },
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="navbar bg-base-100 shadow-md">
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            zIndex: 9999, // Ensure toasts are always on top
            background: "black",
            color: "#fff",
          },
        }}
      />
      {/* Brand Name */}
      <div className="flex-1">
        <Link
          to="/"
          className="btn rounded-xl hover:bg-gray-900 btn-ghost text-2xl font-bold"
        >
          DevTinder
        </Link>
      </div>

      {/* User Section */}
      {user && (
        <div className="flex-none flex items-center gap-4">
          <p className="text-base font-medium text-gray-500">
            Welcome, {user.firstName}
          </p>

          {/* User Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              aria-label="User Menu"
              className="btn btn-ghost btn-circle avatar focus:outline-none"
            >
              <div className="w-10 rounded-full">
                <img
                  src={user.photoUrl}
                  alt={`${user.firstName}'s profile`}
                  className="object-cover"
                />
              </div>
            </div>

            {/* Dropdown Menu */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow-lg"
            >
              <li>
                <Link to="/" className="font-medium hover:rounded-lg">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profile" className="font-medium hover:rounded-lg">
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/connections"
                  className="font-medium hover:rounded-lg"
                >
                  Connections
                </Link>
              </li>
              <li>
                <Link to="/request" className="font-medium hover:rounded-lg">
                  Request
                </Link>
              </li>
              <li>
                <Link to="/premium" className="font-medium hover:rounded-lg">
                  Premium
                </Link>
              </li>

              <li>
                <button
                  onClick={logout}
                  className="font-medium hover:rounded-lg text-red-600 hover:text-red-500"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
