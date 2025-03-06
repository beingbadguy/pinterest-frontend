import { useEffect, useState } from "react";
import { FaPinterest } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import usePinterestStore from "../store/store";

const EntryPage = () => {
  const { checkAuth, userData } = usePinterestStore();
  const [index, setIndex] = useState<number>(0);
  const navigate = useNavigate();

  const sentences = [
    "Chai time snacks idea",
    "Home decor idea",
    "Outfit idea",
    "DIY idea",
  ];
  const color = [
    "text-yellow-500",
    "text-blue-500",
    "text-teal-500",
    "text-red-500",
  ];

  const bgColor = ["bg-yellow-500", "bg-blue-500", "bg-teal-500", "bg-red-500"];

  const backgrounds = [
    "https://images.unsplash.com/photo-1740219148636-824ab17bdd57?q=80&w=2598&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // "https://images.unsplash.com/photo-1718563552473-2d97b224e801?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1724174286667-a0e90006f534?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1723444059774-743b0e6d19e9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1724271362937-391a150db603?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1735657090766-0fa0a6e45be7?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/vector-1740361323396-4cad79f9dea4?q=80&w=2728&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_vector-1739921187995-220ba1f15d73?q=80&w=2630&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1740154093925-ffb8e7ae526e?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1692607334682-59c90d345679?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  const random = Math.floor(Math.random() * 8 + 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % sentences.length);
    }, 3000);

    return () => clearInterval(interval);
  });


  useEffect(() => {
    checkAuth();
  }, []);



  useEffect(() => {
    if (userData) {
      navigate("/home");
    }
  }, [userData]);


  // userData;     


  return (
    <div className="min-h-screen max-h-screen w-full  pt-3">
      {/* Navbar */}
      <div className="flex w-full justify-between items-center px-5">
        <div className="flex items-center gap-1">
          <FaPinterest size={20} className="text-red-600" />
          <p className="text-red-600 font-semibold">Pinterest</p>
        </div>
        <div className="flex gap-2 ">
          <button
            className="bg-red-600 hover:bg-red-800 duration-300 ease-in-out p-2 rounded-3xl text-white w-[80px] cursor-pointer"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 duration-300 ease-in-out p-2 rounded-3xl w-[80px] cursor-pointer"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="block md:hidden  items-center justify-center mt-10 mx-6">
        <motion.img
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -26 }}
          transition={{ duration: index }}
          key={index}
          src={backgrounds[index]}
          alt=""
          className="h-[370px] rounded-3xl w-full object-cover"
        />
      </div>

      {/* Main Page */}
      <div className="flex items-center justify-center mt-20">
        <div className=" text-center">
          <h1 className="text-[56px] md:text-[80px]">Get your next</h1>
          <motion.p
            key={index} // ✅ This forces animation when index updates
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -26 }}
            transition={{ duration: index }}
            className={`font-bold  ${color[index]} text-[26px] md:text-4xl`}
          >
            {sentences[index]}
          </motion.p>
          <div className="mt-8 w-full h-10  flex items-center justify-center gap-4">
            {Array(4)
              .fill(0)
              .map((_, ind) => (
                <span
                  key={Math.random()}
                  className={` ${
                    ind === index ? `${bgColor[index]}` : "bg-gray-200"
                  } rounded-full  size-4 cursor-pointer text-sm `}
                  onClick={() => setIndex(ind)}
                ></span>
              ))}
          </div>
        </div>
      </div>
      {/* image gallery  */}

      <div className=" hidden md:block w-full max-h-[350px] overflow-hidden mt-8 ">
        <div className="grid grid-cols-3 md:grid-cols-5 grid-rows-5 gap-[2px]">
          <div className="row-span-5">
            <motion.img
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -26 }}
              transition={{ duration: index }}
              key={index}
              src={backgrounds[index] + random}
              alt=""
              className="rounded"
            />
          </div>
          <div className="row-span-4 col-start-2 row-start-2">
            {" "}
            <motion.img
              initial={{ opacity: 0, y: 26 - 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -26 }}
              transition={{ duration: index }}
              key={index}
              src={backgrounds[index] + 3}
              alt=""
              className="rounded"
            />
          </div>
          <div className="row-span-3 col-start-3 row-start-3">
            {" "}
            <motion.img
              initial={{ opacity: 0, y: 26 - 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -26 }}
              transition={{ duration: index }}
              key={index}
              src={backgrounds[index] + 3}
              alt=""
              className="rounded"
            />
          </div>
          <div className="row-span-4 col-start-4 row-start-2">
            <motion.img
              initial={{ opacity: 0, y: 26 - 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -26 }}
              transition={{ duration: index }}
              key={index}
              src={backgrounds[index] + 3}
              alt=""
              className="rounded"
            />
          </div>
          <div className="row-span-5 col-start-5 row-start-1">
            {" "}
            <motion.img
              initial={{ opacity: 0, y: 26 - 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -26 }}
              transition={{ duration: index }}
              key={index}
              src={backgrounds[index] + 3}
              alt=""
              className="rounded"
            />
          </div>
        </div>
        <div className="absolute bottom-0 w-full bg-white z-[999] filter blur-1xl ">
          {/* asdasda */}
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
