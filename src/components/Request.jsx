import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { addRequest } from "../utils/requestSlice";
import { Link } from "react-router-dom";
import {
  UserCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Code,
  ArrowLeft,
  BadgeInfo,
  Clock,
  Users,
} from "lucide-react";

const Request = () => {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingRequests, setProcessingRequests] = useState({});

  const fetchRequest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/user/request/received`, {
        withCredentials: true,
      });
      const requestData = response.data.connectionRequestData;
      dispatch(addRequest(requestData));
      setRequests(requestData);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch requests");
      console.error("Request fetch failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequest = async (requestId, status) => {
    try {
      setProcessingRequests((prev) => ({ ...prev, [requestId]: true }));

      const response = await axios.post(
        `${BASE_URL}/connection/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.message) {
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
      }
    } catch (error) {
      console.error(`Failed to ${status} request:`, error);
      const errorMessage =
        error.response?.data?.error || `Failed to ${status} request`;
      alert(errorMessage);
    } finally {
      setProcessingRequests((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const RequestCard = ({ request }) => (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-gray-800 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full p-3 border border-gray-800">
            <UserCircle className="w-12 h-12 text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {request.fromUserId.firstName} {request.fromUserId.lastName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-400">
                    Age: {request.fromUserId.age}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleRequest(request._id, "accepted")}
                  disabled={processingRequests[request._id]}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    processingRequests[request._id]
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30"
                  }`}
                >
                  {processingRequests[request._id] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Accept
                </button>
                <button
                  onClick={() => handleRequest(request._id, "rejected")}
                  disabled={processingRequests[request._id]}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    processingRequests[request._id]
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                  }`}
                >
                  {processingRequests[request._id] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Reject
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-2">
                <BadgeInfo className="w-4 h-4 mt-1 text-purple-400" />
                <p className="text-gray-300">{request.fromUserId.about}</p>
              </div>

              {request.fromUserId.skills?.length > 0 && (
                <div className="flex items-start gap-2">
                  <Code className="w-4 h-4 mt-1 text-purple-400" />
                  <div className="flex flex-wrap gap-2">
                    {request.fromUserId.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-sm border border-blue-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <p>
                  Requested on:{" "}
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-800 rounded-full animate-spin border-t-purple-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-gray-400">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-md mx-auto bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <div className="flex items-center gap-3 text-red-400">
            <XCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              No Pending Requests
            </h2>
            <p className="text-gray-400">
              You don't have any connection requests at the moment.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-all duration-300 border border-purple-500/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/30">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400">Connection Requests</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Pending Connections</h1>
          <p className="text-gray-400">
            You have {requests.length} pending connection{" "}
            {requests.length === 1 ? "request" : "requests"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests.map((request) => (
            <RequestCard key={request._id} request={request} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Request;
