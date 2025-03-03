import { useState } from "react";
import { FaPinterest } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { useParams } from "react-router-dom";
import usePinterestStore from "../store/store";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ChangePasswordPage = () => {
  const {
    resetForgetPassword,
    changePasswordError,
    passwordChangeError,
    isPasswordChanging,
  } = usePinterestStore();
  const { forgetPasswordToken } = useParams();
  // console.log(forgetPasswordToken);
  // const navigate = useNavigate();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      passwordChangeError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      passwordChangeError("Password must be at least 6 characters");
      return;
    }
    if (!forgetPasswordToken) {
      passwordChangeError(
        "Invalid token. Please check your email and try again."
      );
      return;
    } else {
      resetForgetPassword(forgetPasswordToken, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full flex-col">
      <div className="flex items-center gap-1 mr-3 my-4">
        <FaPinterest size={20} className="text-red-600" />
        <p className="text-red-600 font-semibold">Pinterest</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center  flex-col w-[90%] sm:w-[60%] md:w-[40%] gap-3"
      >
        <div className=" flex items-center gap-2 border w-full p-2 rounded border-gray-400">
          <MdOutlinePassword size={24} className="text-gray-400" />
          <input
            type="password"
            className="w-full outline-none"
            placeholder="New Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className=" flex items-center gap-2 border w-full p-2 rounded border-gray-400">
          <MdOutlinePassword size={24} className="text-gray-400" />
          <input
            type="password"
            className="w-full outline-none"
            placeholder="Confirm New Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 transition-all duration-300 text-white cursor-pointer w-full p-2 rounded flex items-center justify-center"
        >
          {isPasswordChanging ? (
            <AiOutlineLoading3Quarters className="animate-spin " size={23} />
          ) : (
            "Change Password"
          )}
        </button>
        <p className="text-red-500">{changePasswordError}</p>
        <p className="mt-2 text-gray-500">
          By clicking "Change Password", you agree to our terms of service and
          privacy policy.
        </p>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
