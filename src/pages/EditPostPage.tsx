import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { AiOutlineLoading } from "react-icons/ai";
import { GoArrowLeft } from "react-icons/go";
interface PostTypeProps {
  _id: string;
  comments: string[];
  createdAt: string;
  imageUrl: string;
  likes: string[];
  updatedAt: string;
  title: string;
  description: string;
}
const EditPostPage = () => {
  const { id } = useParams();
  const [singlePost, setSinglePost] = useState<PostTypeProps>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };
  const handleEditPost = async (id: string) => {
    // Update post data
    setIsEditing(true);
    try {
      const response = await axiosInstance.put(`/post/update/${id}`, {
        title,
        description,
      });
      console.log(response.data);
      setIsEditing(false);
      navigate("/profile");
    } catch (error: any) {
      console.log(error.response);
      setIsEditing(false);
    }
  };

  const fetchPostById = async (id: string) => {
    if (!id) {
      console.log("id is required");
      return;
    }
    try {
      const response = await axiosInstance.get(`/post/get/${id}`);
      // console.log(response.data.post);
      setSinglePost(response.data.post);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (singlePost) {
      setTitle(singlePost.title);
      setDescription(singlePost.description);
    }
  }, [singlePost]);

  useEffect(() => {
    if (id) {
      fetchPostById(id);
    }
  }, [id]);

  return (
    <div>
      <div className=" w-full  py-4 flex items-center justify-between">
        <GoArrowLeft
          size={30}
          className="cursor-pointer"
          onClick={() => {
            window.history.back();
          }}
        />
      </div>
      <h1 className="text-red-500">Edit Post</h1>
      <div className="mt-4">
        <input
          type="text"
          value={title}
          className="border w-full outline-none rounded border-gray-400 p-2"
          onChange={handleTitleChange}
        />

        <textarea
          value={description}
          onChange={handleDescriptionChange}
          className="border w-full outline-none rounded border-gray-400 p-2 mt-4"
          rows={10}
        />
        <button
          onClick={() => {
            if (singlePost?._id) {
              handleEditPost(singlePost._id);
            }
            // setIsEditing(true);
          }}
          className="bg-green-500 px-4 py-1 mt-2 cursor-pointer text-white rounded flex items-center justify-center"
        >
          {isEditing ? (
            <AiOutlineLoading className="animate-spin" size={25} />
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};

export default EditPostPage;
