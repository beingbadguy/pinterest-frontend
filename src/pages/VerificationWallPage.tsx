// import { useEffect } from "react";
import usePinterestStore from "../store/store";
// import { useNavigate } from "react-router-dom";

const VerificationWallPage = () => {
  const { userData } = usePinterestStore();
  // const navigate = useNavigate();
  // console.log(userData);
  //   useEffect(() => {
  //     if (userData?.isAccountVerified) {
  //       navigate("/");
  //     } else if (!userData) {
  //       navigate("/entry");
  //     }
  //   }, [userData]);
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <p className="text-gray-500 text-center">
        Enter the code sent to your mail : {userData?.email}
      </p>
    </div>
  );
};

export default VerificationWallPage;
