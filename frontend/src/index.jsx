import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./style.css";
import App from "./App";
import Root from "./routes/Root";
import ErrorPage from "./routes/ErrorPage";
import Signup from "./routes/Signup";
import Index from "./routes/Index";
import Profile from "./routes/Profile";
import Logout from "./routes/Logout";
import Feed from "./routes/Feed";
import Post from "./routes/Post";
import Saved from "./routes/Saved";
import Search from "./routes/Search";
import Notifications from "./routes/Notifications";

const router = createHashRouter([
  {
    path: "/",
    element: <Root initialUser={window.r2InitialUser} />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/feed",
        element: <Feed />,
      },
      {
        path: "/post/:id",
        element: <Post />,
      },
      {
        path: "/saved",
        element: <Saved />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
