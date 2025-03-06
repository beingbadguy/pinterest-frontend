import { Outlet, useLocation, useNavigate } from "react-router-dom";
import usePinterestStore from "../store/store";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPinterest, FaRegBell } from "react-icons/fa";
import { RiHome3Line } from "react-icons/ri";
import { MdOutlineExplore } from "react-icons/md";
import { VscDiffAdded } from "react-icons/vsc";
import { AiOutlineMessage } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
import useSocketStore from "../store/socket";

const LayoutPage = () => {
  const { userData, logoutUser, allPosts } = usePinterestStore();
  const { connectSocket } = useSocketStore();
  const { pathname } = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const searchHandleRequest = allPosts.filter((post) => {
    if (searchQuery.length >= 1) {
      return post.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  useEffect(() => {
    connectSocket();
    if (!userData) {
      navigate("/entry");
    }
  }, [userData]);
  const handleLogout = () => {
    logoutUser();
  };
  return (
    <div className="flex">
      <div className=" bottom-0 bg-white z-10  w-full flex fixed md:left-0 md:top-0 md:w-20 md:border border-gray-300  items-center justify-between flex-row md:flex-col  md:h-[100vh] border-t-1">
        <div className="w-full bg-white md:w-auto p-2 flex items-center justify-center flex-row md:flex-col md:mt-10 gap-4 md:gap-8 z-10 ">
          <div
            className=" hidden md:flex hover:bg-red-100 transition-all duration-300 cursor-pointer w-full p-2 rounded text-red-500  items-center justify-center"
            onClick={() => {
              navigate("/");
            }}
          >
            <FaPinterest size={25} />
          </div>
          <div
            className="hover:bg-red-100 flex items-center justify-center transition-all duration-300 cursor-pointer w-full p-2 rounded"
            onClick={() => {
              navigate("/home");
            }}
          >
            <RiHome3Line size={25} />
          </div>
          <div
            className="hover:bg-red-100 flex items-center justify-center transition-all duration-300 cursor-pointer w-full p-2 rounded"
            onClick={() => {
              navigate("/");
            }}
          >
            <MdOutlineExplore size={25} />
          </div>
          <div
            className="hover:bg-red-100 flex items-center justify-center transition-all duration-300 cursor-pointer w-full p-2 rounded"
            onClick={() => {
              navigate("/create");
            }}
          >
            <VscDiffAdded size={25} />
          </div>
          <div
            className="hover:bg-red-100 flex items-center justify-center transition-all duration-300 cursor-pointer w-full p-2 rounded"
            onClick={() => {
              navigate("/notification");
            }}
          >
            <FaRegBell size={25} />
          </div>
          <div
            className="hover:bg-red-100 flex items-center justify-center transition-all duration-300 cursor-pointer w-full p-2 rounded"
            onClick={() => {
              navigate("/message");
            }}
          >
            <AiOutlineMessage size={25} />
          </div>
        </div>

        <div>
          <div
            className="hover:bg-red-100  transition-all duration-300 cursor-pointer w-full p-2 rounded md:mb-10 md:flex items-center justify-center hidden "
            onClick={() => {
              handleLogout();
            }}
          >
            <IoLogOutOutline size={25} />
          </div>
        </div>
      </div>
      <div className="fixed top-0 md:left-20 flex items-center justify-center flex-col w-full md:w-[90%] lg:w-[95%]">
        <nav
          className={` ${
            pathname.includes("/chat") ? "hidden" : ""
          } w-full flex items-center gap-2 p-4 relative`}
        >
          <div className="w-full  p-2 bg-gray-200 rounded flex items-center">
            <CiSearch size={23} className="text-gray-500" />
            <input
              type="text"
              className="w-full ml-2 outline-none"
              placeholder="Search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
            />
          </div>
          {/* user icon  */}
          <div
            className="cursor-pointer "
            onClick={() => {
              navigate("/profile");
            }}
          >
            <img
              src={userData?.profilePic}
              alt={userData?.name}
              className="size-10 rounded border-2 border-red-500"
            />
          </div>
          {/* search results  */}
          {searchHandleRequest.length > 0 ? (
            <div className="absolute w-[98%] rounded top-[80%] left-4 bg-gray-200  p-2 shadow-xl flex items-start justify-start flex-col gap-2 z-[9999]">
              {searchHandleRequest.map((post) => (
                <div
                  key={post._id}
                  className="break-inside-avoid cursor-pointer  flex items-center gap-2 hover:text-gray-500"
                  onClick={() => {
                    navigate(`/post/${post._id}`);
                    setSearchQuery("");
                  }}
                >
                  <CiSearch />
                  <h1>{post.title}</h1>
                </div>
              ))}
              {/* <div className="text-center text-gray-500">No Results Found</div> */}
            </div>
          ) : searchQuery.length > 0 ? (
            <div className="absolute w-[98%] rounded top-[80%] left-4 bg-gray-200  p-2 shadow-xl z-[9999]">
              <div className="text-center text-red-500">No Results Found</div>
            </div>
          ) : (
            ""
          )}
        </nav>
        <div
          className={`w-full overflow-y-auto h-screen  ${
            pathname.includes("chat") ? "" : "px-4"
          } `}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutPage;
