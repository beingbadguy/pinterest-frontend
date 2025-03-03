import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutPage from "./layout/LayoutPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import EntryPage from "./pages/EntryPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import ForgetPasswordPage from "./pages/ForgetPasswordPage.tsx";
import UserPage from "./pages/UserPage.tsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.tsx";
import VerificationWallPage from "./pages/VerificationWallPage.tsx";
import ExplorePage from "./pages/ExplorePage.tsx";
import CreatePage from "./pages/CreatePage.tsx";
import NotificationPage from "./pages/NotificationPage.tsx";
import MessagePage from "./pages/MessagePage.tsx";
import SinglePostPage from "./pages/SinglePostPage.tsx";
import EditPostPage from "./pages/EditPostPage.tsx";
import SingleUserPage from "./pages/SingleUserPage.tsx";
import GlobalPage from "./pages/GlobalPage.tsx";
import ChatPage from "./pages/ChatPage.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/home",
        element: <GlobalPage />,
      },
      {
        path: "/explore",
        element: <ExplorePage />,
      },
      {
        path: "/create",
        element: <CreatePage />,
      },
      {
        path: "/notification",
        element: <NotificationPage />,
      },
      {
        path: "/message",
        element: <MessagePage />,
      },
      {
        path: "/profile",
        element: <UserPage />,
      },
      {
        path: "/post/:id",
        element: <SinglePostPage />,
      },
      {
        path: "/updatepost/:id",
        element: <EditPostPage />,
      },
      {
        path: "/singleuser/:id",
        element: <SingleUserPage />,
      },
      {
        path: "/chat/:id",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "/entry",
    element: <EntryPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forget",
    element: <ForgetPasswordPage />,
  },
  {
    path: "/change/:forgetPasswordToken",
    element: <ChangePasswordPage />,
  },
  {
    path: "/wall",
    element: <VerificationWallPage />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
