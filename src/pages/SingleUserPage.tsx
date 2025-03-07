import { FaPinterest } from "react-icons/fa";
import usePinterestStore from "../store/store";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

interface UserType {
  _id: string;
  username: string;
  email: string;
  name: string;
  profilePic: string;
  isAccountVerified: boolean;
  followers: string[];
  following: string[];
  posts: AllPostType[];
  createdAt: string;
  updatedAt: string;
}

interface AllPostType {
  _id: string;
  comments: string[];
  createdAt: string;
  imageUrl: string;
  likes: string[];
  updatedAt: string;
  user: AllPostType;
  title: string;
  description: string;
}

const SingleUserPage = () => {
  const { allPosts, getAllPosts, checkAuth, userData } = usePinterestStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<UserType>();

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

  const postsByThisUser = allPosts.filter((post) => {
    return post.user === id;
  });

  const followUnfollowUser = async (id: string) => {
    if (!id) {
      console.log("No user ID provided");
      return;
    }
    try {
      await axiosInstance.post(`/user/followunfollowuser/${id}`);
      // console.log(response.data);
      fetchThisUser(id);
      checkAuth();
      getAllPosts();
    } catch (error: any) {
      console.log(error?.response.data.message);
    }
  };

  useEffect(() => {
    getAllPosts();
    if (id) {
      fetchThisUser(id);
    }
  }, []);

  return (
    <div className="min-h-screen overflow-auto h-auto flex items-center justify-start flex-col mb-48 md:mb-20 ">
      <div className=" w-full p-4 flex items-center justify-between">
        <GoArrowLeft
          size={30}
          className="cursor-pointer"
          onClick={() => {
            window.history.back();
          }}
        />
      </div>
      <div className="w-full flex items-center justify-center flex-col ">
        <div className="relative">
          <img
            src={user?.profilePic}
            alt=""
            className="size-34 rounded-full object-cover border border-gray-400"
          />
        </div>

        <h1 className="w-full  text-center text-3xl font-bold my-2">
          {" "}
          {user?.name}
        </h1>

        <div className="flex items-center justify-center gap-1 text-gray-500">
          <FaPinterest />
          <p className="text-gray-500">{user?.username}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="my-2 font-bold text-xl">
            {user?.followers.length} Followers
          </div>
          <div className="my-2 font-bold text-xl">
            {user?.following.length} Following
          </div>
        </div>
        <div
          className={` ${
            userData?._id && user?.followers.includes(userData._id)
              ? "bg-gray-400 hover:bg-gray-500 text-black"
              : "bg-red-500 hover:bg-red-600"
          } ${
            user && user._id == userData?._id ? "hidden" : ""
          } transition-all duration-300 cursor-pointer px-4 py-1 rounded text-white`}
          onClick={() => {
            if (id) {
              followUnfollowUser(id);
            }
          }}
        >
          {userData?._id && user?.followers.includes(userData._id)
            ? "Unfollow"
            : "Follow"}
        </div>
      </div>

      <hr className="w-full border-gray-200 my-3" />
      <h1 className="w-full text-left font-bold text-xl text-gray-600">
        Posts ({postsByThisUser.length})
      </h1>
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6  ">
        {postsByThisUser.map((post) => (
          <div
            key={post._id}
            className="break-inside-avoid mt-1 cursor-pointer relative"
            onClick={() => {
              navigate(`/post/${post._id}`);
            }}
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full rounded-md border border-gray-200 object-cover  "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleUserPage;
