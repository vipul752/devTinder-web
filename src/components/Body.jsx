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
    if (user) return;
    try {
      const response = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(response.data));
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        toast.error("Please login to continue.", {
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
  }, []);

  return (
    <div className="overflow-y-hidden">
      <Toaster position="bottom-right" reverseOrder={false} />
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Body;
