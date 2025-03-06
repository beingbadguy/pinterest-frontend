import { FaPinterest, FaRegUser } from "react-icons/fa";
import { AiOutlineLoading3Quarters, AiOutlineMail } from "react-icons/ai";
import { MdOutlineAlternateEmail, MdOutlinePassword } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { useEffect, useState } from "react";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";
import usePinterestStore from "../store/store";

interface UserPropTypes {
  name: string;
  username: string;
  email: string;
  password: string;
}

const SignupPage = () => {
  const {
    isSigningUp,
    handleSignupError,
    signupError,
    signupUser,
    checkAuth,
    userData,
  } = usePinterestStore();
  const [showPass, setShowPass] = useState<boolean>(false);

  const [user, setUser] = useState<UserPropTypes>({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleLogin = (e: any) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password || !user.username) {
      handleSignupError("Please enter all the information");
      return;
    }
    if (user.password.length < 6) {
      handleSignupError("Password must be at least 8 characters");
      return;
    }
    const emailRegex = /^[\w.-]+@[a-zA-Z\d-]+(\.[a-zA-Z]{2,})+$/;
    if (!emailRegex.test(user.email)) {
      handleSignupError("Invalid email format");
      return;
    } else {
      handleSignupError("");
      signupUser(user);
    }
  };

  useEffect(() => {
    checkAuth();
    if (userData) {
      navigate("/");
    }
  }, [userData]);

  return (
    <div
      className="w-full flex items-center justify-center  p-4 bg-white rounded-lg flex-col text-black shadow-xl h-screen"
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
      <h1 className="my-2">Welcome Back, Signup here!</h1>
      <form
        onSubmit={handleLogin}
        className="my-2 flex items-center justify-center gap-3 flex-col  w-[90%] md:w-[60%] lg:w-[40%] xl:w-[30%]"
      >
        <div className="w-full flex items-center border p-1 rounded border-gray-400">
          <FaRegUser size={22} className="ml-2 text-gray-400" />
          <input
            type="text"
            placeholder="Name"
            className="p-1 ml-2  w-full rounded  focus:outline-none "
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex items-center border p-1 rounded border-gray-400">
          <MdOutlineAlternateEmail size={25} className="ml-2 text-gray-400" />
          <input
            type="text"
            placeholder="Username"
            className="p-1 ml-2  w-full rounded  focus:outline-none "
            name="username"
            value={user.username}
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex items-center border p-1 rounded border-gray-400">
          <AiOutlineMail size={25} className="ml-2 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            className="p-1 ml-2  w-full rounded  focus:outline-none "
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
          className="w-full flex items-center justify-center  bg-red-600 hover:bg-red-800 duration-300 ease-in-out p-2 rounded-3xl text-white cursor-pointer"
          type="submit"
        >
          {isSigningUp ? (
            <AiOutlineLoading3Quarters className="animate-spin " size={23} />
          ) : (
            "Signup"
          )}
        </button>

        {signupError && <p className="text-red-500">{signupError}</p>}

        <hr className="border w-full border-gray-300 mt-7 " />
        <div className="px-2 flex items-center justify-center -mt-8 bg-white">
          <p className="mt-2 text-center">
            Already have an account?{" "}
            <span
              className="text-red-600  cursor-pointer"
              onClick={() => {
                navigate("/login");
              }}
            >
              Log In
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
