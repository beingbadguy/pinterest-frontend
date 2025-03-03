import { AiOutlineMail } from "react-icons/ai";
import usePinterestStore from "../store/store";
import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";

const ForgetPasswordPage = () => {
  const { handleForgetError, forgetError, sendForgetPasswordRequest } =
    usePinterestStore();
  const [email, setEmail] = useState<string>("");
  const forgetHandler = () => {
    if (!email) {
      handleForgetError("Please enter a valid email");
    }
    const emailRegex = /^[\w.-]+@[a-zA-Z\d-]+(\.[a-zA-Z]{2,})+$/;
    if (!emailRegex.test(email)) {
      handleForgetError("Invalid email format");
      return;
    } else {
      handleForgetError("");
      sendForgetPasswordRequest(email);
      setEmail("");
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center gap-2 flex-col">
      <div
        className="absolute  top-6 left-6 cursor-pointer"
        onClick={() => {
          window.history.back();
        }}
      >
        <GoArrowLeft size={25} />
      </div>
      <h1 className="text-red-400 font-bold">FORGOT PASSWORD ?</h1>
      <p className="text-gray-500 text-center">
        Send a link to your email to reset your password
      </p>
      <div className="border rounded border-gray-300 p-2 w-[90%] md:w-[40%] flex items-center ">
        <AiOutlineMail size={22} className="text-gray-400" />
        <input
          type="email"
          placeholder="Email"
          className="ml-2 w-full outline-none"
          onChange={(e) => {
            setEmail(e.target.value);
            handleForgetError("");
          }}
        />
      </div>
      <div
        className="bg-red-500 hover:bg-red-600 text-white transition-all rounded mt-2 p-2 w-[90%] md:w-[40%] flex items-center justify-center  text-center cursor-pointer"
        onClick={() => {
          forgetHandler();
        }}
      >
        Send reset link
      </div>
      <p className="text-red-600">{forgetError}</p>
    </div>
  );
};

export default ForgetPasswordPage;
