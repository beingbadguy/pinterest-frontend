import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import usePinterestStore from "./store";
import { axiosInstance } from "../api/axiosInstance";

const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_URL;

interface UserType {
  _id: string;
  username: string;
  email: string;
  name: string;
  profilePic: string;
  isAccountVerified: boolean;
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}

interface MessagesPropsType {
  receiverId: UserType;
  senderId: UserType;
  text: string;
  createdAt: string;
}

interface SocketPropType {
  socket: Socket | null;
  onlineUsers: string[];
  messages: MessagesPropsType[];
  selectedUser: UserType | null;
  getMessages: () => void;
  setSelectedUser: (user: UserType) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
  subscribeToMessages: () => void;
  sendMessage: (user: UserType, text: string) => void;
  unsubscribeToMessage: () => void;
}

const useSocketStore = create<SocketPropType>((set, get) => ({
  socket: null,
  onlineUsers: [],
  selectedUser: null,
  messages: [],

  getMessages: async () => {
    const { selectedUser } = get();
    if (!selectedUser) return console.log("No user selected.");
    try {
      const response = await axiosInstance.get(
        `/message/receive/${selectedUser._id}`
      );
      // console.log(response.data.messages);
      set({ messages: response.data.messages });
    } catch (error: any) {
      console.log(error.response.message);
    }
  },

  subscribeToMessages: () => {
    const socket = get().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.on("newMessage", (message) => {
      // console.log("New Message:", message);
      const { messages } = get();
      set({
        messages: [
          ...messages,
          {
            ...message,
            receiverId: message.receiverId?._id || message.receiverId,
            senderId: message.senderId?._id || message.senderId,
          },
        ],
      });
    });
  },

  sendMessage: async (user: UserType, text: string) => {
    if (!user) return;
    try {
      await axiosInstance.post(`/message/send/${user._id}`, { text });
      get().getMessages();
    } catch (error: any) {
      console.log(error.response);
    }
  },

  setSelectedUser: (user: UserType) => {
    get().unsubscribeToMessage();
    set({ selectedUser: user });
    get().getMessages();
    get().subscribeToMessages();
  },

  connectSocket: () => {
    const userData = usePinterestStore.getState().userData;
    if (!userData) return;
    if (get().socket?.connected) return;
    const socket = io(SOCKET_BASE_URL, { query: { userId: userData._id } });
    socket.on("connect", () => {
      // console.log("Socket Connected 🟢:", socket.id);
      get().subscribeToMessages();
    });
    socket.on("getOnlineUsers", (userIds) => set({ onlineUsers: userIds }));
    socket.on("disconnect", () => set({ socket: null, onlineUsers: [] }));
    set({ socket });
    return () => {
      socket.off("connect");
      socket.off("getOnlineUsers");
      socket.off("disconnect");
      socket.off("newMessage");
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    };
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (!socket?.connected) return;
    socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  },

  unsubscribeToMessage: () => {
    const socket = get().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
}));

export default useSocketStore;
