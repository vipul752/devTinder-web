import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { Send, UserCircle, MoreHorizontal } from "lucide-react";

let socket;

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const user = useSelector((state) => state.user);
  const userId = user?._id;
  

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
        { firstName, message, timestamp: new Date() },
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
          isOwnMessage: true,
        },
      ]);

      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f5f7fa] to-[#e6e9f0] text-gray-800">
      {/* Chat Container */}
      <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-100 p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                { targetUserId|| "Conversation"}
              </h2>
              <p className="text-sm text-gray-500">
                {isTyping ? "Typing..." : "Active now"}
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f9fafb]">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No messages yet. Start chatting!
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xl px-5 py-3 rounded-2xl shadow-md ${
                    msg.isOwnMessage
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                      : "bg-white text-gray-800 border border-gray-100"
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

        {/* Message Input */}
        <div className="bg-white border-t border-gray-100 p-6">
          <form onSubmit={sendMessage} className="flex space-x-3">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 text-gray-800 rounded-full px-5 py-3 
              focus:outline-none focus:ring-2 focus:ring-purple-300 
              transition-all duration-300 text-sm"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-gradient-to-br from-purple-500 to-pink-500 
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
