import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addFeed } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constant";
import {
  Heart,
  X,
  RefreshCw,
  MapPin,
  Briefcase,
  User,
  AlertTriangle,
  Loader,
  Stars,
  Calendar,
  Music,
  Coffee,
  Book,
} from "lucide-react";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const getFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/feed?page=1&limit=100`, {
        headers: {
          Authorization: token,
        },
        withCredentials: true,
      });
      dispatch(addFeed(response.data.data));
    } catch (error) {
      setError("Failed to load profiles. Please try again later.");
      console.error("Failed to fetch feed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleAction = async (action) => {
    if (actionLoading) return;

    const currentUser = feed[currentIndex];
    const status = action === "interested" ? "interested" : "ignored";

    try {
      setActionLoading(true);
      setSlideDirection(action === "interested" ? "right" : "left");

      await axios.post(
        `${BASE_URL}/connection/send/${status}/${currentUser._id}`,
        {},
        { withCredentials: true }
      );

      setTimeout(() => {
        if (currentIndex < feed.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setShowDetails(false);
        }
        setSlideDirection("");
      }, 300);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to process your request");
      setSlideDirection("");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 animate-spin-slow">
            <div className="h-32 w-32 rounded-full border-t-2 border-b-2 border-purple-500"></div>
          </div>
          <div className="text-center space-y-4 p-8">
            <Stars className="w-12 h-12 text-purple-500 mx-auto animate-pulse" />
            <p className="text-gray-300 animate-pulse font-light tracking-wider">
              Discovering your perfect match...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-6">
        <div className="text-center p-8 bg-red-500/10 backdrop-blur-md rounded-3xl max-w-md border border-red-500/20 shadow-2xl">
          <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4 animate-bounce" />
          <p className="text-red-200 mb-6 font-light tracking-wide">{error}</p>
          <button
            onClick={() => {
              setError(null);
              getFeed();
            }}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-purple-500 
              text-white rounded-xl transition-all duration-500 
              hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20
              hover:from-red-600 hover:to-purple-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = feed[currentIndex];
  const hasProfiles =
    Array.isArray(feed) && feed.length > 0 && currentIndex < feed.length;

  return (
    <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))]  p-6">
      <div className="max-w-md mx-auto pt-8">
        <h1 className="text-5xl font-bold text-center mb-12">
          <span
            className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 
            bg-clip-text text-transparent animate-gradient-x"
          >
            Find Your Destiny
          </span>
        </h1>

        {hasProfiles ? (
          <div
            className={`transform transition-all duration-500 ${
              slideDirection === "left"
                ? "-translate-x-full opacity-0"
                : slideDirection === "right"
                ? "translate-x-full opacity-0"
                : "translate-x-0"
            }`}
          >
            <div
              className="relative group rounded-[2rem] bg-white/10 backdrop-blur-md 
              shadow-2xl overflow-hidden border border-white/20 
              hover:border-purple-500/30 transition-all duration-500"
            >
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 
                via-black/40 to-transparent z-10"
              />

              <div className="relative h-[32rem] overflow-hidden">
                <img
                  src={currentProfile.photoUrl}
                  alt={`${currentProfile.firstName} ${currentProfile.lastName}`}
                  className="w-full h-full object-cover transform transition-transform 
                    duration-700 ease-out group-hover:scale-110"
                />

                {/* Sparkle effects */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-700"
                >
                  <div
                    className="absolute top-1/4 left-1/4 w-2 h-2 bg-white 
                    rounded-full animate-ping"
                  />
                  <div
                    className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-400 
                    rounded-full animate-ping delay-100"
                  />
                  <div
                    className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-pink-400 
                    rounded-full animate-ping delay-200"
                  />
                </div>
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 z-20 transition-all 
                  duration-700 ease-out ${showDetails ? "h-4/5" : "h-1/3"}`}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/95 
                  via-black/80 to-transparent backdrop-blur-md"
                />

                <div className="relative p-6 h-full">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 
                      rounded-full bg-white/10 backdrop-blur-md border border-white/20
                      flex items-center justify-center transition-transform duration-500
                      hover:scale-110 hover:border-purple-500/50 group/btn"
                  >
                    <User
                      className={`w-6 h-6 transition-transform duration-500
                      ${showDetails ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>

                  <div className="space-y-6">
                    <div className="flex items-end justify-between">
                      <h2
                        className="text-4xl font-bold bg-gradient-to-r from-white 
                        to-purple-300 bg-clip-text text-transparent"
                      >
                        {currentProfile.firstName} {currentProfile.lastName}
                      </h2>
                      <span className="text-lg text-gray-300 font-light">
                        {currentProfile.gender}
                      </span>
                    </div>

                    {showDetails && (
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          {["about", "interests", "skills"].map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className={`px-4 py-2 rounded-lg transition-all duration-300
                                ${
                                  activeTab === tab
                                    ? "bg-purple-500/30 text-white"
                                    : "text-gray-400 hover:text-white"
                                }`}
                            >
                              {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                          ))}
                        </div>

                        <div className="h-40 overflow-y-auto custom-scrollbar">
                          {activeTab === "about" && (
                            <p className="text-gray-300 leading-relaxed">
                              {currentProfile.about}
                            </p>
                          )}

                          {activeTab === "skills" && (
                            <div className="flex flex-wrap gap-2">
                              {currentProfile.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-4 py-2 bg-gradient-to-r from-pink-500/30 
                                    to-purple-500/30 rounded-lg text-sm font-medium 
                                    backdrop-blur-sm border border-white/10 hover:border-purple-500/50
                                    transition-all duration-300 hover:scale-105"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center gap-6 pt-4">
                      <button
                        onClick={() => handleAction("ignored")}
                        disabled={actionLoading}
                        className="flex-1 bg-gray-800/80 hover:bg-red-600/80 text-white 
                          px-6 py-4 rounded-xl font-medium backdrop-blur-sm 
                          transition-all duration-500 hover:scale-105 hover:shadow-lg 
                          hover:shadow-red-500/20 group/skip"
                      >
                        <X
                          className="w-6 h-6 mx-auto transition-transform duration-500 
                          group-hover/skip:rotate-12"
                        />
                      </button>

                      <button
                        onClick={() => handleAction("interested")}
                        disabled={actionLoading}
                        className="flex-1 bg-gradient-to-r from-pink-500/80 to-purple-500/80 
                          hover:from-pink-600 hover:to-purple-600 text-white px-6 py-4 
                          rounded-xl font-medium transition-all duration-500 
                          hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 
                          group/like relative overflow-hidden"
                      >
                        <Heart
                          className="w-6 h-6 mx-auto transition-transform duration-500 
                          group-hover/like:scale-110"
                        />
                        <div
                          className="absolute inset-0 bg-white/20 transform -translate-x-full
                          group-hover/like:translate-x-full transition-transform duration-1000"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400 tracking-wider">
                {feed.length - currentIndex} more incredible matches await
              </p>
            </div>
          </div>
        ) : (
          <div
            className="text-center p-8 bg-white/5 rounded-3xl backdrop-blur-md 
            border border-white/10 shadow-2xl"
          >
            <Stars className="w-16 h-16 mx-auto text-purple-500 mb-4 animate-pulse" />
            <p className="text-xl text-gray-300 mb-6 font-light tracking-wide">
              You've explored all profiles for now
            </p>
            <button
              onClick={getFeed}
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 
                to-purple-500 rounded-xl transition-all duration-500 
                hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20
                overflow-hidden"
            >
              <span className="relative z-10 font-medium tracking-wider">
                Discover More
              </span>
              <div
                className="absolute inset-0 bg-white/20 transform -translate-x-full
                group-hover:translate-x-full transition-transform duration-1000"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
