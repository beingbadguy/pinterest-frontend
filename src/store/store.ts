import { create } from "zustand";
import { axiosInstance } from "../api/axiosInstance";
import useSocketStore from "./socket";

interface UserType {
  _id: string;
  username: string;
  email: string;
  name: string;
  profilePic: string;
  isAccountVerified: boolean;
  followers: string[];
  following: string[];
  posts: AllPostType[];
  createdAt: string;
  updatedAt: string;
}

interface signupType {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface loginType {
  email: string;
  password: string;
}

interface postType {
  title: string;
  description: string;
  image: File;
}

interface AllPostType extends postType {
  _id: string;
  comments: string[];
  createdAt: string;
  imageUrl: string;
  likes: string[];
  updatedAt: string;
  user: string;
}

interface PinterestStoreType {
  userData: UserType | null;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  signupError: string | null;
  loginError: string | null;
  forgetError: string | null;
  changePasswordError: string | null;
  isPasswordChanging: boolean;
  isPostUploading: boolean;
  postError: string | null;
  allPosts: AllPostType[];
  allUsers: UserType[];
  getAllUsers: () => void;
  likeUnlikePost: (id: string) => void;
  getAllPosts: () => void;
  handlePostError: (err: string) => void;
  handleSignupError: (err: string) => void;
  handleLoginError: (err: string) => void;
  passwordChangeError: (err: string) => void;
  signupUser: (data: signupType) => void;
  loginUser: (data: loginType) => void;
  logoutUser: () => void;
  checkAuth: () => void;
  handleForgetError: (err: string) => void;
  sendForgetPasswordRequest: (email: string) => void;
  resetForgetPassword: (token: string, password: string) => void;
  handleCreatePost: (data: postType) => void;
}

const usePinterestStore = create<PinterestStoreType>((set, get) => ({
  userData: null,
  isLoggingIn: false,
  isSigningUp: false,
  isPasswordChanging: false,
  signupError: null,
  loginError: null,
  forgetError: null,
  changePasswordError: null,
  isPostUploading: false,
  postError: null,
  allPosts: [],
  allUsers: [],
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get("/user/allusers");
      // console.log(response?.data);
      set({ allUsers: response?.data.users });
    } catch (error: any) {
      console.log(error.message);
    }
  },
  likeUnlikePost: async (id) => {
    if (!id) {
      console.log("No post ID provided");
      return;
    }
    try {
      const response = await axiosInstance.post(`/post/like-unlike/${id}`);
      console.log(response?.data);
      const { getAllPosts } = get();
      getAllPosts();
    } catch (error: any) {
      console.log(error.response);
    }
  },

  getAllPosts: async () => {
    try {
      const response = await axiosInstance.get("/post/get-all-posts");
      // console.log(response?.data);
      set({ allPosts: response?.data.posts });
    } catch (error: any) {
      console.log(error.message);
    }
  },
  handlePostError: (err: string) => {
    set({ postError: err });
    setTimeout(() => {
      set({ postError: null });
    }, 3000);
  },
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      set({ userData: response?.data?.user });
      // const { userData } = get();
      // console.log(userData);
      const { getAllPosts } = get();
      getAllPosts();
      const connectSocket = useSocketStore.getState().connectSocket;
      console.log("check auth ran");
      connectSocket();
      // if (!userData?.isAccountVerified) {
      //   window.location.href = "/wall";
      // }
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    }
  },
  signupUser: async (data) => {
    try {
      set({ isSigningUp: true });
      const response = await axiosInstance.post("/auth/signup", data);
      // console.log(response?.data);
      set({ isSigningUp: false, userData: response?.data?.user });
      set({ signupError: null });
      // window.location.href = "/wall";
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      set({ signupError: error?.response?.data?.message });
      set({ isSigningUp: false });
    }
  },
  loginUser: async (data) => {
    try {
      set({ isLoggingIn: true });
      const response = await axiosInstance.post("/auth/login", data);
      // console.log(response?.data);
      set({ isLoggingIn: false, userData: response?.data?.user });
      // const { userData } = get();
      // if (!userData?.isAccountVerified) {
      //   window.location.href = "/wall";
      // }
      // const connectSocket = useSocketStore.getState().connectSocket;
      // console.log("login ran");

      // connectSocket();
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      set({ loginError: error?.response?.data?.message });
      set({ isLoggingIn: false });
    }
  },
  logoutUser: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ userData: null });
      window.location.href = "/entry";
      const disconnectSocket = useSocketStore.getState().disconnectSocket;
      disconnectSocket();
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      set({ userData: null });
    }
  },
  handleForgetError: (err: string) => {
    set({ forgetError: err });
  },
  sendForgetPasswordRequest: async (email) => {
    try {
      await axiosInstance.post("/auth/forget", {
        email,
      });
      // console.log(response?.data?.message);
      set({
        forgetError: "Email sent successfully. Please check your inbox.",
      });
      setTimeout(() => {
        set({ forgetError: null });
        window.location.href = "/";
      }, 3000);
    } catch (error: any) {
      console.log(error.response.data.message);
      const { handleForgetError } = get();
      handleForgetError(error?.response?.data?.message);
    }
  },
  resetForgetPassword: async (forgetPasswordToken, password) => {
    set({ isPasswordChanging: true });
    try {
      const response = await axiosInstance.post(
        `/auth/forget-password/${forgetPasswordToken}`,
        { password }
      );
      // console.log(response?.data?.message);
      const { passwordChangeError } = get();
      passwordChangeError(response?.data?.message);
      set({ isPasswordChanging: false });
      setTimeout(() => {
        set({ forgetError: null });
        window.location.href = "/";
      }, 3000);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      set({ isPasswordChanging: false });
    }
  },
  passwordChangeError: (err: string) => {
    set({ changePasswordError: err });
  },
  handleLoginError: (err) => {
    console.log(err);
    set({ loginError: err });
    setTimeout(() => {
      set({ loginError: null });
    }, 3000);
  },
  handleSignupError: (err) => {
    console.log(err);
    set({ signupError: err });
    setTimeout(() => {
      set({ signupError: null });
    }, 3000);
  },
  handleCreatePost: async (data) => {
    set({ isPostUploading: true });
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("image", data.image);
      const response = await axiosInstance.post("/post/create-post", formData);
      // console.log(response?.data);
      set({
        isPostUploading: false,
        postError: null,
        userData: response?.data.user,
      });
      window.location.href = "/";
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      set({
        postError: error?.response?.data?.message,
        isPostUploading: false,
      });
    }
  },
}));

export default usePinterestStore;
