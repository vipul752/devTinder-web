import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./Navbar";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const fetchUser = async () => {
    const token = localStorage.getItem("authToken");

    // If we have a token but no user in Redux state
    if (token && !user) {
      // Set up axios defaults
      axios.defaults.withCredentials = true;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await axios.get(`${BASE_URL}/profile/view`);


        dispatch(addUser(response.data));
      } catch (error) {
        console.error("Auth error:", error);

        localStorage.removeItem("authToken");
        delete axios.defaults.headers.common["Authorization"];

        toast.error("Session expired. Please login again.", {
          style: {
            background: "#f44336",
            color: "#fff",
          },
        });

        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // Run only on mount

  return (
    <div className="overflow-y-hidden">
      <Toaster position="bottom-right" reverseOrder={false} />
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Body;
