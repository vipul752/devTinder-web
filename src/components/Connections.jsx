import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addConnection } from "../utils/connectionSlice";
import { BASE_URL } from "../utils/constant";
import {
  UserCircle,
  Mail,
  MapPin,
  Code,
  MessageCircle,
  Loader2,
  Search,
  Filter,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  // Fetch connections from backend
  const fetchConnections = async () => {
    const token = localStorage.getItem("authToken");
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/user/connection/accepted`, {
        withCredentials: true,
      });
      const connectionData = response.data.connections || [];
      dispatch(addConnection(connectionData));
      setConnections(connectionData);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch connections. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // Filter connections based on search and selected skill
  const filteredConnections = connections.filter((connection) => {
    const nameMatch = `${connection.firstName} ${connection.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const skillMatch =
      !selectedSkill || connection.skills?.includes(selectedSkill);
    return nameMatch && skillMatch;
  });

  // Get all unique skills
  const allSkills = [...new Set(connections.flatMap((c) => c.skills || []))];

  const ConnectionCard = ({ connection }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={`bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-xl transition-all duration-500 border border-gray-800 
          ${isHovered ? "scale-102 shadow-2xl -translate-y-1" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-t-2xl">
          <div
            className={`h-28 bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-900 
            transition-all duration-700 ${isHovered ? "scale-105" : ""}`}
          />
          <div className="absolute -bottom-12 left-6">
            <div className="bg-gray-900 p-2 rounded-full ring-4 ring-gray-900 shadow-lg">
              <UserCircle
                className={`w-20 h-20 transition-colors duration-300 
                ${isHovered ? "text-purple-400" : "text-gray-400"}`}
              />
            </div>
          </div>
        </div>

        <div className="p-6 pt-16">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {connection.firstName} {connection.lastName}
              </h2>
              {connection.age && (
                <div className="flex items-center text-gray-400 mt-2 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Age: {connection.age}</span>
                </div>
              )}
            </div>
            <Link to={`/chat/${connection._id}`}>
              <button className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-300">
                <MessageCircle className="w-6 h-6 text-purple-400" />
              </button>
            </Link>
          </div>

          <div className="mt-4 text-gray-300">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 mt-1 text-purple-400" />
              <p className="text-sm leading-relaxed">
                {connection.about || "No bio available"}
              </p>
            </div>
          </div>

          {connection.skills?.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-gray-300">
                  Skills
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {connection.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-1.5 rounded-full 
                    text-sm text-gray-300 hover:from-purple-900 hover:to-blue-900 transition-colors duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-purple-900 animate-pulse" />
          <Loader2 className="w-10 h-10 animate-spin text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-400 animate-pulse">
          Loading your connections...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container min-h-screen mx-auto p-8 bg-gray-900">
        <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
            <p className="text-red-300">{error}</p>
          </div>
        </div>
        <Link
          to="/"
          className="fixed top-8 right-8 flex items-center gap-2 text-gray-400 hover:text-gray-200 
          transition-all duration-300 bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </Link>
      </div>
    );
  }

  if (!connections.length) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-md w-full bg-gray-900/90 backdrop-blur-md border border-gray-800 shadow-xl rounded-2xl p-8">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="bg-purple-900/30 p-4 rounded-full animate-pulse">
              <AlertCircle className="h-10 w-10 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-200 mb-3">
                No Connections Yet
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Start connecting with other users to build your professional
                network!
              </p>
            </div>
            <Link
              to="/discover"
              className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 
              text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 
              shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <span>Discover People</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                My Connections
              </h1>
              <p className="text-gray-400">
                Connected with {connections.length} professional
                {connections.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search connections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-700 bg-gray-800 text-gray-200 
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none 
                  transition-all duration-300 w-full sm:w-64 placeholder-gray-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-700 bg-gray-800 text-gray-200 
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none 
                  transition-all duration-300 appearance-none w-full sm:w-48"
                >
                  <option value="">All Skills</option>
                  {allSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
              <Link
                to="/discover"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 
                to-blue-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 
                transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Find More
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {filteredConnections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No connections match your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredConnections.map((connection) => (
                <ConnectionCard key={connection._id} connection={connection} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connections;
