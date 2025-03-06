import { FaPinterest } from "react-icons/fa";
import { AiOutlineLoading3Quarters, AiOutlineMail } from "react-icons/ai";
import { MdOutlinePassword } from "react-icons/md";
// import usePinterestStore from "../store/store";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { PiEyeThin } from "react-icons/pi";
import { PiEyeSlashThin } from "react-icons/pi";
import usePinterestStore from "../store/store";
import { GoArrowLeft } from "react-icons/go";
interface UserType {
  email: string;
  password: string;
}

const LoginPage = () => {
  const {
    loginUser,
    isLoggingIn,
    checkAuth,
    userData,
    loginError,
    handleLoginError,
  } = usePinterestStore();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleLogin = (e: any) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      handleLoginError("Please enter all the information");
      return;
    }
    if (user.password.length < 6) {
      handleLoginError("Password must be at least 6 characters");
      return;
    }
    const emailRegex = /^[\w.-]+@[a-zA-Z\d-]+(\.[a-zA-Z]{2,})+$/;
    if (!emailRegex.test(user.email)) {
      handleLoginError("Invalid email format");
      return;
    } else {
      loginUser(user);
    }
  };

  useEffect(() => {
    checkAuth();
    if (userData) {
      navigate("/home");
    }
  }, [userData]);

  return (
    <div
      className="w-full flex items-center justify-center  p-4 bg-white rounded-lg flex-col text-black shadow-xl h-screen "
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        className="absolute top-6 left-6 cursor-pointer"
        onClick={() => {
          navigate("/entry");
        }}
      >
        <GoArrowLeft size={25} />
      </div>
      <div className="flex items-center gap-1">
        <FaPinterest size={20} className="text-red-600" />
        <p className="text-red-600 font-semibold">Pinterest</p>
      </div>
      <h1 className="my-2">Welcome Back, Login here!</h1>
      <form
        onSubmit={handleLogin}
        className="my-2 w-[96%] sm:w-[80%] md:w-[50%] lg:w-[40%] xl:w-[30%] flex items-center justify-center gap-4 flex-col "
      >
        <div className="w-full flex items-center border p-1 rounded border-gray-400">
          <AiOutlineMail size={25} className="ml-2 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            className="p-1 ml-2  w-full rounded  outline-none"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex items-center border p-1 rounded border-gray-400">
          <MdOutlinePassword size={25} className="ml-2 text-gray-400" />
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="p-1 ml-2  w-full rounded outline-none"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
          {showPass ? (
            <PiEyeThin
              size={20}
              className="mr-2 cursor-pointer text-gray-700"
              onClick={() => {
                setShowPass(!showPass);
              }}
            />
          ) : (
            <PiEyeSlashThin
              size={20}
              className="mr-2 cursor-pointer text-gray-700"
              onClick={() => {
                setShowPass(!showPass);
              }}
            />
          )}
        </div>
        <button
          className="w-full  bg-red-600 hover:bg-red-800 duration-300 ease-in-out p-2 rounded-3xl text-white cursor-pointer flex items-center justify-center"
          type="submit"
        >
          {isLoggingIn ? (
            <AiOutlineLoading3Quarters className="animate-spin " size={23} />
          ) : (
            "Login"
          )}
        </button>
        {loginError && <p className="text-red-500">{loginError}</p>}

        <div
          className="text-right w-full text-gray-500  cursor-pointer"
          onClick={() => {
            navigate("/forget");
          }}
        >
          Forget Password
        </div>
        <hr className="border w-full border-gray-300 mt-2 " />
        <div className="px-2 flex items-center justify-center -mt-7 bg-white">
          <p className="text-center">
            Don't have an account?{" "}
            <span
              className="text-red-600  cursor-pointer"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign Up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
