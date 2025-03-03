import { useEffect, useState } from "react";
import usePinterestStore from "../store/store";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useSocketStore from "../store/socket";

const ExplorePage = () => {
  const { allUsers, getAllUsers } = usePinterestStore();
  const { onlineUsers } = useSocketStore();
  const navigate = useNavigate();

  const [nameToFind, setNameToFind] = useState<string>("");
  const findUser = allUsers.filter((user) => {
    return user.name.toLowerCase().includes(nameToFind.toLowerCase());
  });

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div>
      <h1 className="font-semibold text-lg ">All Users</h1>
      <div className="border flex items-center gap-1 rounded  border-gray-200 my-2">
        <input
          type="text"
          className="w-full  p-2  outline-none"
          placeholder="Enter name to search user"
          value={nameToFind}
          onChange={(e) => setNameToFind(e.target.value)}
        />
        <IoCloseOutline
          className={`  ${
            nameToFind.length > 0 ? "" : "hidden"
          } mr-2  cursor-pointer text-gray-500`}
          size={25}
          onClick={() => {
            setNameToFind("");
          }}
        />
      </div>
      <div>
        {findUser.length > 0 ? (
          <div className="flex flex-col gap-3 mt-2 cursor-pointer ">
            {findUser?.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-4 py-2 bg-gray-50 hover:bg-gray-100 transition-all duration-300 px-2 rounded relative"
                onClick={() => {
                  navigate(`/singleuser/${user._id}`);
                }}
              >
                <div
                  className={`${
                    onlineUsers && onlineUsers.includes(user._id)
                      ? ""
                      : "hidden"
                  } absolute size-4 border-white p-1 border-2 bg-green-500   rounded-full left-10 top-2`}
                ></div>
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="size-10 object-cover rounded-full"
                />
                <div>
                  <h2>{user.name}</h2>
                  <h2 className="text-gray-400 italic text-sm">
                    @{user.username}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-red-600">
            No User found with this name, try another name
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
