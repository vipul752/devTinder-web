import { io } from "socket.io-client";
import { BASE_URL } from "./constant";

const createSocketConnection = () => {
  return io(BASE_URL);
};

export { createSocketConnection };
