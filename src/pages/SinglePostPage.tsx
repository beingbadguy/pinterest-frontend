import { useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { IoIosArrowDown, IoIosHeartEmpty } from "react-icons/io";
import { IoDownloadOutline } from "react-icons/io5";
import usePinterestStore from "../store/store";
import { AiOutlineSend } from "react-icons/ai";
import { formatDistanceToNow } from "date-fns";

interface UserPropTyes {
  _id: string;
  avatar: string;
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
  user: UserPropTyes;
  __v: 0;
  _id: string;
}

interface PostTypeProps {
  _id: string;
  comments: CommentPropTypes[];
  createdAt: string;
  imageUrl: string;
  likes: string[];
  updatedAt: string;
  user: UserPropTyes;
  title: string;
  description: string;
}

const SinglePostPage = () => {
  const { allPosts, getAllPosts, userData } = usePinterestStore();
  const [singlePost, setSinglePost] = useState<PostTypeProps>();
  const [text, setText] = useState<string>("");
  const [showComment, setShowComment] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const likeUnlikePost = async (postId: string) => {
    if (!id) {
      console.log("No post ID provided");
      return;
    }
    try {
      const response = await axiosInstance.post(`/post/like-unlike/${postId}`);
      setSinglePost(response.data.post);
    } catch (error: any) {
      console.log(error.response);
    }
  };

  const fetchPostById = async (id: string) => {
    if (!id) {
      console.log("id is required");
      return;
    }
    try {
      const response = await axiosInstance.get(`/post/get/${id}`);
      setSinglePost(response.data.post);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const getPostOtherThanThisOne = allPosts.filter((post) => {
    return post._id !== id;
  });

  const addComment = async (id: string) => {
    if (!id || !text) {
      console.log("No post ID or comment text provided");
      return;
    }
    try {
      await axiosInstance.post(`/comment/add/${id}`, {
        text,
      });
      setText("");
      fetchPostById(id);
      getAllPosts();
    } catch (error: any) {
      console.log(error.response);
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
    const fetchDataAndScroll = async () => {
      if (id) {
        await fetchPostById(id);
        await getAllPosts();
        setHasFetched(true);
      }
    };

    fetchDataAndScroll();
  }, [id]);

  useEffect(() => {
    if (hasFetched) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
      setHasFetched(false);
    }
  }, [hasFetched]);

  return (
    <div key={id} className="mb-40 md:mb-20">
      <div className="w-full flex items-center justify-between">
        <GoArrowLeft
          size={30}
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>
      <div className="flex items-start flex-col md:flex-row w-full relative">
        <div className="p-4 rounded-sm" style={{ minHeight: "400px" }}>
          <img
            src={singlePost?.imageUrl}
            alt={singlePost?.title}
            className="size-[400px] rounded-xl object-contain"
          />
        </div>
        <div className="p-4 flex items-start justify-center flex-col">
          <div
            className="flex items-center justify-center gap-2 my-2 bg-gray-100  p-2 cursor-pointer hover:bg-gray-200 transition-all duration-300 rounded-4xl"
            onClick={() => {
              navigate(`/singleuser/${singlePost?.user._id}`);
            }}
          >
            <img
              src={singlePost?.user.profilePic}
              alt=""
              className="size-10 rounded-full object-cover"
            />
            <p>@{singlePost?.user.username}</p>
          </div>
          <div className="flex items-center gap-4">
            <IoIosHeartEmpty
              className={`${
                userData && singlePost?.likes.includes(userData?._id)
                  ? "text-red-500 bg-red-100"
                  : ""
              } my-2 cursor-pointer hover:bg-gray-200 rounded-full p-2`}
              size={45}
              onClick={() => {
                if (singlePost?._id) {
                  likeUnlikePost(singlePost._id);
                  if (id) {
                    fetchPostById(id);
                  }
                }
              }}
            />
            <p>{singlePost?.likes.length}</p>
            <IoDownloadOutline
              className="my-2 cursor-pointer hover:bg-gray-200 rounded-full p-2"
              size={45}
              onClick={(e) => {
                if (singlePost) {
                  downloadImage(singlePost?.imageUrl, e);
                }
              }}
            />
          </div>
          <h1 className="text-2xl font-bold">{singlePost?.title}</h1>
          <p className="mt-2 text-gray-500">{singlePost?.description}</p>
          <div className="mt-1 flex items-center w-[300px] justify-between">
            <p className="font-bold">{singlePost?.comments.length} Comments</p>
            <p
              onClick={() => {
                setShowComment(!showComment);
              }}
              className={`${
                singlePost && singlePost?.comments.length > 0
                  ? "block"
                  : "hidden"
              }`}
            >
              <IoIosArrowDown
                className={`${
                  showComment ? "" : "rotate-180"
                } transition-all duration-300 cursor-pointer`}
                size={20}
              />
            </p>
          </div>
          <div
            className={`hidescrollbar mt-2 flex flex-col gap-2 ${
              showComment ? "h-20" : "h-0"
            } transition-all duration-300 w-full overflow-y-scroll`}
          >
            {singlePost?.comments.map((comment) => (
              <div key={comment._id} className="flex items-center gap-2">
                <img
                  src={comment.user.profilePic}
                  alt=""
                  className="size-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">{comment.user.username}</p>
                  <p>{comment.text}</p>
                  <p className="text-gray-400 text-sm">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border border-gray-300 rounded-3xl flex items-center mt-20">
            <input
              type="text"
              placeholder="Add a comment..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              className="border-none outline-none px-2 p-2 w-[250px] md:w-[300px]"
            />
            <div
              className="hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer p-1 rounded mr-3"
              onClick={() => {
                if (id) {
                  addComment(id);
                }
              }}
            >
              <AiOutlineSend className="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      <hr className="border border-gray-200" />
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 mt-2">
        {getPostOtherThanThisOne.map((post) => (
          <div
            key={post._id}
            className="break-inside-avoid mt-1 cursor-pointer"
            onClick={() => {
              navigate(`/post/${post._id}`);
            }}
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full rounded-md border border-gray-200 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SinglePostPage;
