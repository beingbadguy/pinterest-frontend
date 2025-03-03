import { FaPinterest } from "react-icons/fa";
import usePinterestStore from "../store/store";
import { GoArrowLeft } from "react-icons/go";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MdAddAPhoto,
  MdOutlineClose,
  MdOutlineDeleteOutline,
} from "react-icons/md";
import { axiosInstance } from "../api/axiosInstance";
import { CiEdit, CiMinimize1 } from "react-icons/ci";
import { BsCheck2 } from "react-icons/bs";

const UserPage = () => {
  const { userData, logoutUser, allPosts, getAllPosts, checkAuth } =
    usePinterestStore();
  const navigate = useNavigate();

  const [deletePost, setDeletePost] = useState<number | null>(null);
  const [image, changeImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const postsbyuser = allPosts.filter((post) => {
    return post.user === userData?._id;
  });

  const handleDeletePost = async (postId: string) => {
    if (!postId) {
      console.log("No post ID provided");
      return;
    }
    // console.log(postId);
    try {
      await axiosInstance.delete(`/post/delete/${postId}`);
      // console.log(response.data);
      getAllPosts();
      setDeletePost(null);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const changeProfilePicture = async () => {
    if (!image) {
      console.log("No image provided frontend");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await axiosInstance.put(
        "/user/update-profile-picture",
        formData
      );
      console.log(response.data.user);
      changeImage(null);
      checkAuth();
      getAllPosts();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const changeName = async () => {
    if (!name) {
      console.log("No name provided frontend");
      return;
    }
    try {
      const response = await axiosInstance.put("/user/update-name", {
        name,
      });
      console.log(response.data.user);
      changeImage(null);
      checkAuth();
      getAllPosts();
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    if (userData) {
      setName(userData?.name);
    }
  }, [userData]);

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="min-h-screen overflow-auto h-auto flex items-center justify-start flex-col mb-32 md:mb-20 ">
      <div className=" w-full py-4 flex items-center justify-between">
        <GoArrowLeft
          size={30}
          className="cursor-pointer"
          onClick={() => {
            window.history.back();
          }}
        />
        <IoIosLogOut
          size={30}
          onClick={() => {
            logoutUser();
            navigate("/entry");
          }}
        />
      </div>
      <div className="w-full flex items-center justify-center flex-col ">
        <div className="relative">
          <img
            src={image ? URL.createObjectURL(image) : userData?.profilePic}
            alt=""
            className="size-34 rounded-full object-cover border border-gray-400"
          />

          <div
            className={` ${
              image ? "" : "hidden"
            } absolute left-1 top-2 bg-white p-1 rounded-full cursor-pointer`}
            onClick={() => {
              if (image) {
                URL.revokeObjectURL(URL.createObjectURL(image));
                changeImage(null);
              }
            }}
          >
            <MdOutlineClose />
          </div>

          <div
            className={` ${
              image ? "" : "hidden"
            } absolute right-1 top-2 bg-white p-1 rounded-full cursor-pointer`}
            onClick={() => {
              changeProfilePicture();
            }}
          >
            <BsCheck2 />
          </div>
          <div
            className={` ${
              image ? "hidden" : ""
            } absolute right-1 top-[70%] bg-white p-1 rounded-full cursor-pointer`}
          >
            <MdAddAPhoto size={20} />
            <div className="overflow-hidden">
              <input
                type="file"
                accept="image/*"
                name=""
                id=""
                className="size-6 border absolute top-0 opacity-0 cursor-pointer z-[9999]"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    changeImage(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
        </div>
        {isEditing ? (
          <div className="text-center w-full flex items-center justify-center gap-2">
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded w-[80%] md:w-[40%] my-2 outline-none"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <BsCheck2
              className=" cursor-pointer"
              size={30}
              onClick={() => {
                changeName();
                setIsEditing(false);
              }}
            />
            <MdOutlineClose
              className="cursor-pointer"
              size={30}
              onClick={() => {
                setIsEditing(false);
                if (userData) {
                  setName(userData.name);
                }
              }}
            />
          </div>
        ) : (
          <h1 className="w-full  text-center text-3xl font-bold my-2">
            {" "}
            {userData?.name}
          </h1>
        )}
        <div className="flex items-center justify-center gap-1 text-gray-500">
          <FaPinterest />
          <p className="text-gray-500">{userData?.username}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="my-2 font-bold text-xl">
            {userData?.followers.length} Followers
          </div>
          <div className="my-2 font-bold text-xl">
            {userData?.following.length} Following
          </div>
        </div>
      </div>
      <div
        className="bg-gray-200 hover:bg-gray-300 cursor-pointer p-2 rounded-lg"
        onClick={() => {
          setIsEditing(true);
        }}
      >
        Edit Profile
      </div>
      <hr className="w-full border-gray-200 my-2" />
      <h1 className="w-full text-left font-bold text-xl text-gray-600">
        Posts ({postsbyuser.length})
      </h1>
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6  ">
        {postsbyuser.map((post, index) => (
          <div
            key={post._id}
            className="break-inside-avoid mt-1 cursor-pointer relative"
            onMouseEnter={() => {
              setDeletePost(index);
            }}
            onMouseLeave={() => {
              setDeletePost(null);
            }}
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full rounded-md border border-gray-200 object-cover  "
            />

            <div
              className={` ${
                deletePost == index ? "" : "hidden"
              } flex items-center justify-between  p-2 absolute bottom-0 right-[40%] text-red-500 bg-white  text-xl rounded-t-lg`}
              onClick={() => {
                navigate(`/post/${post._id}`);
              }}
            >
              <CiMinimize1 />
            </div>

            <div
              className={` ${
                deletePost == index ? "" : "hidden"
              } flex items-center justify-between  p-2 absolute top-0 right-0 text-red-500 bg-white  text-xl rounded-bl-lg`}
              onClick={() => {
                handleDeletePost(post._id);
              }}
            >
              <MdOutlineDeleteOutline />
            </div>

            <div
              className={` ${
                deletePost == index ? "" : "hidden"
              } flex items-center justify-between  p-2 absolute top-0 left-0 text-red-500 bg-white  text-xl rounded-br-lg`}
              onClick={() => {
                // handleDeletePost(post._id);
                navigate(`/updatepost/${post._id}`);
              }}
            >
              <CiEdit />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
