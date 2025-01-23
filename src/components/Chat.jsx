import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { Send, UserCircle, MoreHorizontal } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

let socket;

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUserName, setTargetUserName] = useState("");
  const messagesEndRef = useRef(null);

  const user = useSelector((state) => state.user);
  const userId = user?._id;

  const fetchChatMessage = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessage = chat?.data?.messages.map((msg) => {
        return {
          message: msg.text,
          firstName: msg.senderId.firstName,
          timestamp: new Date(msg.createdAt),
        };
      });

      setMessages(chatMessage);
    } catch (error) {
      console.error("Error fetching chat messages", error);
    }
  };

  useEffect(() => {
    fetchChatMessage();
  }, [targetUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    socket = createSocketConnection();

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("newMessage", ({ message, firstName }) => {
      setMessages((prev) => [
        ...prev,
        { firstName, message, timestamp: new Date(), isOwnMessage: false },
      ]);
    });



    return () => {
      if (socket) socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (socket && newMessage.trim()) {
      socket.emit("sendMessage", {
        firstName: user.firstName,
        message: newMessage,
        userId,
        targetUserId,
      });

      setMessages((prev) => [
        ...prev,
        {
          firstName: user.firstName,
          message: newMessage,
          timestamp: new Date(),
        },
      ]);

      setNewMessage("");
    }
  };


  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1f1f1f] to-[#121212] text-gray-200">
      <div className="w-full max-w-4xl mx-auto bg-[#1a1a1a] shadow-2xl rounded-3xl overflow-hidden flex flex-col">
        <div className="bg-[#1a1a1a] border-b border-gray-700 p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6b46c1] to-[#e74694] rounded-full flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-200">
                {targetUserName || "Conversation"}
              </h2>
              
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">
            <MoreHorizontal />
          </button>
        </div>

        <div className="flex flex-col space-y-4 px-6 py-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No messages yet. Start chatting!
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  user.firstName === msg.firstName
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xl px-5 py-3 rounded-2xl shadow-md ${
                    user.firstName === msg.firstName
                      ? "bg-gradient-to-br from-[#6b46c1] to-[#e74694] text-white"
                      : "bg-[#1a1a1a] text-gray-200 border border-gray-700"
                  }`}
                >
                  <p className="break-words text-sm">{msg.message}</p>
                  <div className="flex justify-between items-center mt-2 text-xs opacity-75">
                    <span className="font-medium">{msg.firstName}</span>
                    <span>
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-[#1a1a1a] border-t border-gray-700 p-6">
          <form onSubmit={sendMessage} className="flex space-x-3">
            <input
              value={newMessage}
            
              placeholder="Type your message..."
              className="flex-1 bg-[#212121] text-gray-200 rounded-full px-5 py-3 
              focus:outline-none focus:ring-2 focus:ring-[#6b46c1] 
              transition-all duration-300 text-sm"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-gradient-to-br from-[#6b46c1] to-[#e74694] 
              text-white rounded-full w-12 h-12 flex items-center justify-center 
              hover:opacity-90 transition-all duration-300 
              disabled:opacity-50 disabled:cursor-not-allowed 
              shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
