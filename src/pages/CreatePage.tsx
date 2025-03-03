import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import usePinterestStore from "../store/store";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CreatePage = () => {
  const { isPostUploading, postError, handlePostError, handleCreatePost } =
    usePinterestStore();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!title || !description || !image) {
      handlePostError("Please fill out all the fields");
      return;
    }
    handleCreatePost({ title, description, image });
  };

  return (
    <div className="min-h-screen mb-20">
      <h1 className="font-bold text-xl">Create Post</h1>
      <div className="flex flex-col md:flex-row mt-2 md:mt-10 gap-4 w-full">
        <div className="w-full">
          {image ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="size-full h-[400px] rounded border p-2  border-gray-400 object-contain cursor-pointer"
              />
              <IoCloseOutline
                className="bg-gray-200 text-black rounded-full size-5 absolute -top-2 -right-2"
                onClick={() => {
                  setImage(null);
                  URL.revokeObjectURL(URL.createObjectURL(image));
                }}
              />
            </div>
          ) : (
            <div className="size-full min-h-64 md:min-h-96 border-2 border-dashed rounded border-gray-400 overflow-hidden relative cursor-pointer w-full">
              <input
                accept="image/*"
                type="file"
                className="h-[260px] md:h-[400px] w-full border opacity-0 cursor-pointer z-[9999] absolute"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0]);
                  }
                }}
              />
              <MdOutlineFileUpload
                className="absolute left-1/2 top-1/2 text-gray-400 -translate-x-1/2 -translate-y-1/2"
                size={30}
              />
            </div>
          )}
        </div>

        <div className="w-full">
          <input
            type="text"
            className="border w-full outline-none rounded border-gray-400 p-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            cols={10}
            rows={5}
            className="border my-2 border-gray-400 w-full rounded p-2 outline-none"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button
            className="w-full bg-red-500 text-white font-bold py-2 rounded hover:bg-red-600 cursor-pointer flex items-center justify-center"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleSubmit(e)
            }
          >
            {isPostUploading ? (
              <AiOutlineLoading3Quarters className="animate-spin " size={23} />
            ) : (
              "Create Post"
            )}
          </button>
          {postError && <p className="text-red-500 my-2">{postError}</p>}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
