import { useEffect, useState, useRef } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { IoIosArrowDown, IoIosHeartEmpty } from "react-icons/io";
import { IoDownloadOutline } from "react-icons/io5";
import usePinterestStore from "../store/store";
import { AiOutlineSend } from "react-icons/ai";
import { formatDistanceToNow } from "date-fns";

interface UserPropTypes {
  _id: string;
  avatar?: string;
  email: string;
  fullName: string;
  isAccountVerified: boolean;
  posts: string[];
  username: string;
  profilePic: string;
  followers: string[];
  following: string[];
}

interface CommentPropTypes {
  createdAt: string;
  post: string;
  text: string;
  updatedAt: string;
  user: UserPropTypes;
  __v: number;
  _id: string;
}

interface PostTypeProps {
  _id: string;
  comments: CommentPropTypes[];
  createdAt: string;
  imageUrl: string;
  likes: string[];
  updatedAt: string;
  user: UserPropTypes;
  title: string;
  description: string;
}

const SinglePostPage = () => {
  const { allPosts, getAllPosts, userData } = usePinterestStore();
  const [singlePost, setSinglePost] = useState<PostTypeProps | null>(null);
  const [text, setText] = useState<string>("");
  const [showComment, setShowComment] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const topRef = useRef<HTMLDivElement>(null);

  const likeUnlikePost = async (postId: string) => {
    try {
      const response = await axiosInstance.post(`/post/like-unlike/${postId}`);
      setSinglePost(response.data.post);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const fetchPostById = async (postId: string) => {
    try {
      const response = await axiosInstance.get(`/post/get/${postId}`);
      setSinglePost(response.data.post);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const addComment = async () => {
    if (!id || !text.trim()) return;
    try {
      await axiosInstance.post(`/comment/add/${id}`, { text });
      setText("");
      fetchPostById(id);
      getAllPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const downloadImage = async (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Pinterest-clone.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostById(id);
      getAllPosts();
    }
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [id, location.key]);

  return (
    <div ref={topRef} className="mb-72 md:mb-20">
      <GoArrowLeft
        size={30}
        className="cursor-pointer"
        onClick={() => navigate(-1)}
      />
      <div className="flex flex-col md:flex-row w-full relative">
        <div className="p-4 rounded-sm min-h-[400px]">
          {singlePost && (
            <img
              src={singlePost.imageUrl}
              alt={singlePost.title}
              className="size-[400px] rounded-xl object-contain"
            />
          )}
        </div>
        <div className="p-4 flex flex-col">
          {singlePost && (
            <>
              <div
                className="flex items-center gap-2 my-2 bg-gray-100 p-2 cursor-pointer hover:bg-gray-200 rounded-4xl"
                onClick={() => navigate(`/singleuser/${singlePost.user._id}`)}
              >
                <img
                  src={singlePost.user.profilePic}
                  alt=""
                  className="size-10 rounded-full object-cover"
                />
                <p>@{singlePost.user.username}</p>
              </div>
              <div className="flex items-center gap-4">
                <IoIosHeartEmpty
                  className={`cursor-pointer hover:bg-gray-200 rounded-full p-2 ${
                    userData && singlePost.likes.includes(userData._id)
                      ? "text-red-500 bg-red-100"
                      : ""
                  }`}
                  size={45}
                  onClick={() => likeUnlikePost(singlePost._id)}
                />
                <p>{singlePost.likes.length}</p>
                <IoDownloadOutline
                  className="cursor-pointer hover:bg-gray-200 rounded-full p-2"
                  size={45}
                  onClick={(e) => downloadImage(singlePost.imageUrl, e)}
                />
              </div>
              <h1 className="text-2xl font-bold">{singlePost.title}</h1>
              <p className="mt-2 text-gray-500">{singlePost.description}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;
