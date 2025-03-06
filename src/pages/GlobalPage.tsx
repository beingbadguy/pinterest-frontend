import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface AllPostType {
  _id: string;
  title: string;
  description: string;
  image: string;
  comments: string[];
  createdAt: string;
  imageUrl: string;
  likes: string[];
  updatedAt: string;
  user: string;
}

const GlobalPage = () => {
  const navigate = useNavigate();
  const [followedPost, setFollowedPost] = useState<AllPostType[]>();
  const getfollowedposts = async () => {
    try {
      const response = await axiosInstance.get(`/post/getfollowedposts`);
      console.log(response?.data);
      setFollowedPost(response?.data.posts);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getfollowedposts();
  }, []);
  return (
    <div className="mb-40 md:mb-0">
      <p className="font-semibold">Posts from followed users</p>
      {followedPost && followedPost.length > 0 ? (
        ""
      ) : (
        <p className="w-full flex items-center justify-center text-red-400 h-50 text-center">
          People you follow haven't posted anything
        </p>
      )}
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 mb-34 md:mb-20">
        {followedPost &&
          followedPost.map((post) => (
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

export default GlobalPage;
