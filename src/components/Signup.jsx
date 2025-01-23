import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { Toaster, toast } from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { BASE_URL } from "../utils/constant";

// Shared styles for form inputs
const inputClasses = `
  w-full p-3 pl-10 bg-gray-800/50 text-white placeholder-gray-400 
  rounded-lg border border-gray-600 focus:outline-none focus:ring-2 
  focus:ring-blue-500 transition-all duration-300 backdrop-blur-sm
`;

const buttonClasses = `
  w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white 
  font-medium py-3 rounded-lg transition-all duration-300 shadow-lg
  hover:scale-[1.02] hover:shadow-blue-500/20 hover:from-blue-700 
  hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed
  active:scale-[0.98]
`;

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        BASE_URL +  "/signup",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailId: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      dispatch(addUser(response.data.data));
      toast.success("Account created successfully! 🎉", {
        duration: 2000,
        className: "bg-gray-900 text-white",
      });
      navigate("/profile");
    } catch (error) {
      toast.error(error?.response?.data || "Signup failed", {
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center p-4">
    

      <div className="w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-800">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full shadow-xl">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Join our community today
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {["firstName", "lastName"].map((field) => (
                <div key={field} className="relative group">
                  <User
                    className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 
                    transition group-hover:text-blue-500"
                  />
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={
                      field === "firstName" ? "First Name" : "Last Name"
                    }
                    className={inputClasses}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="relative group">
              <Mail
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 
                transition group-hover:text-blue-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className={inputClasses}
                required
              />
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 
                transition group-hover:text-blue-500"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={inputClasses}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-white
                  transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={buttonClasses}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="h-5 w-5 animate-spin rounded-full border-2 
                    border-white border-t-transparent"
                  />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
