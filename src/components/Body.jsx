import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./Navbar";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { toast, Toaster } from "react-hot-toast";
import { useEffect } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Accessing user state from Redux
  const user = useSelector((state) => state.user);

  // Fetch user details if not already in the state
  const fetchUser = async () => {
    if (user) return; // Skip fetching if user is already logged in
    try {
      const response = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true, // Include cookies for authentication
      });
      dispatch(addUser(response.data)); // Add user to Redux store
    } catch (error) {
      console.error(error);

      // Handle specific errors
      if (error.response?.status === 401) {
        toast.error("Please login to continue.", {
          style: {
            background: "#f44336", // Error toast background
            color: "#fff", // White text for contrast
          },
        });
        navigate("/login"); // Redirect to login page
      } else {
        // General error handler
        toast.error("Something went wrong. Please try again.", {
          style: {
            background: "#f44336",
            color: "#fff",
          },
        });
      }
    }
  };

  // Call fetchUser on component mount
  useEffect(() => {
    fetchUser();
  }, [user]); // Add `user` as a dependency to prevent redundant calls

  return (
    <div className="overflow-y-hidden">
      {/* Toast notifications */}
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* Navigation Bar */}
      <NavBar />

      {/* Child components will render here */}
      <Outlet />
    </div>
  );
};

export default Body;
