import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import useSocketStore from "../store/socket";
import { IoMdSend } from "react-icons/io";
import usePinterestStore from "../store/store";
import { MdKeyboardArrowLeft } from "react-icons/md";

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

const ChatPage = () => {
  const {
    onlineUsers,
    sendMessage,
    getMessages,
    messages,
    unsubscribeToMessage,
    subscribeToMessages,
    socket,
    selectedUser,
  } = useSocketStore();
  const { id } = useParams();
  const { userData } = usePinterestStore();
  // console.log(selectedUser);
  const [user, setUser] = useState<UserType>();
  const navigate = useNavigate();
  const [text, setText] = useState<string>("");
  const [senderId, setSenderId] = useState<string | undefined>("");
  const [receiverId, setReceiverId] = useState<string | undefined>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const fetchThisUser = async (id: string) => {
    if (!id) {
      console.log("No user ID provided");
      return;
    }
    try {
      const response = await axiosInstance.get(`/user/user/${id}`);
      // console.log(response.data.user);
      setUser(response.data.user);
    } catch (error: any) {
      console.log(error?.response);
    }
  };
  // console.log(socket);

  const typingEvent = () => {
    // console.log(socket?.id);
    if (socket) {
      socket.emit("typing", { senderId, receiverId });
    }
  };
  const stopTyping = () => {
    if (socket) {
      socket.emit("stopTyping", { senderId, receiverId });
    }
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]); // ✅ Messages change hote hi scroll hoga

  useEffect(() => {
    if (id) {
      fetchThisUser(id);
      getMessages();
    }
    setSenderId(userData?._id);
    if (selectedUser) {
      setReceiverId(selectedUser._id);
    }
  }, [id]);

  useEffect(() => {
    subscribeToMessages();
    return () => {
      unsubscribeToMessage();
    };
  }, [id]);

  useEffect(() => {
    console.log("event running");
    if (socket) {
      socket.on("typing", (data) => {
        console.log(data); // ✅ Yeh aa raha hai
        setIsTyping(data.typing); // Yahi dikkat hai 😏
      });
    }
    return () => {
      if (socket) {
        socket.off("typing");
      }
    };
  }, [socket]);

  return (
    <div className="">
      <div className=" rounded fixed w-full md:w-[91%] lg:w-[93%]">
        <div className="flex items-center  relative cursor-pointer bg-gray-100 text-sm p-2 ">
          <div
            onClick={() => {
              window.history.back();
            }}
          >
            <MdKeyboardArrowLeft size={35} />
          </div>
          <div
            className="flex items-center gap-3 relative cursor-pointer bg-gray-100 text-sm p-2"
            onClick={() => {
              navigate(`/singleuser/${user?._id}`);
            }}
          >
            <img
              src={user?.profilePic}
              alt={user?.profilePic}
              className="size-10 object-cover rounded-full  "
            />
            <div
              className={`${
                onlineUsers && user && onlineUsers.includes(user._id)
                  ? ""
                  : "hidden"
              } absolute size-2 bg-green-500 rounded-full left-10 top-3`}
            ></div>
            <div>
              <h1>{user?.name}</h1>
              <div className="text-gray-400 flex gap-1 text-center">
                @{user?.username}{" "}
                {isTyping && <div className="text-gray-400">is typing...</div>}
              </div>
            </div>
          </div>
        </div>
        {/* message box  */}

        {messages.length > 0 ? (
          <div
            ref={chatContainerRef}
            className="hidescrollbar bg-white my-2 mr-10 md:mr-2  pb-14 md:pb-0 max-h-[70vh] md:h-[70vh] overflow-y-scroll pl-3"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 ${
                  msg.senderId._id === userData?._id
                    ? " text-gray-500 justify-end mt-2 "
                    : " text-gray-500 justify-start mt-2 "
                }`}
              >
                <div
                  className={`${
                    msg.senderId._id === userData?._id ? "" : "flex-row-reverse"
                  }  flex gap-1`}
                >
                  {" "}
                  <div
                    className={` ${
                      msg.senderId._id === userData?._id
                        ? "bg-red-500 text-white"
                        : "text-black"
                    } bg-gray-200 p-2 rounded  max-w-[250px] sm:max-w-[400px] inline-block break-words`}
                  >
                    {msg.text}
                  </div>
                  <img
                    src={
                      msg.senderId._id === userData?._id
                        ? userData.profilePic
                        : user?.profilePic
                    }
                    alt={msg.senderId.username}
                    className="size-6 object-cover rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-20">
            Start conversation by saying Hi❤️
          </div>
        )}

        {/* send box  */}
        <div className="fixed bottom-14 md:bottom-0 py-4 w-full flex items-center justify-start bg-gray-50 rounded">
          <div className="border border-gray-300 rounded-lg w-[90%] md:w-[85%] lg:w-[88%] md:ml-4 flex items-center ml-4">
            <input
              type="text"
              placeholder="Type Something..."
              className="border-none outline-none p-2 w-full"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                typingEvent();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (text && user) {
                    sendMessage(user, text);
                    setText("");
                    stopTyping();
                  }
                }
              }}
              onBlur={() => {
                stopTyping();
              }}
            />
            <div
              className="bg-red-500 text-white p-3 mr-0 rounded-r cursor-pointer  "
              onClick={() => {
                if (text && user) {
                  sendMessage(user, text);
                  setText("");
                }
              }}
            >
              <IoMdSend className="" size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
