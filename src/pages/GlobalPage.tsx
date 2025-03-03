import { useEffect } from "react";
import { axiosInstance } from "../api/axiosInstance";

const GlobalPage = () => {
  // getfollowedposts;
  const getfollowedposts = async () => {
    try {
      const response = await axiosInstance.get(`/post/getfollowedposts`);
      console.log(response?.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getfollowedposts();
  }, []);
  return <div>GlobalPage</div>;
};

export default GlobalPage;
