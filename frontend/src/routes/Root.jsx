import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../style.css";
import Messages from "../components/Messages";
import { API_BASE } from "../constants";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import brunchy from "../images/brunchy-color.png";
import feed from "../images/feed-color.png";
import search from "../images/search-color.png";
import random from "../images/random-color.png";
import saved from "../images/saved-color.png";
import notificationsActive from "../images/notifications-active.png";
import notificationsInactive from "../images/notifications-inactive.png";
import profileSketch from "../images/profile-sketch-color.png";
import logout from "../images/logout-color.png";

export default function Root() {
  const [user, setUser] = useState();
  const [userNotifications, setUserNotifications] = useState([]);
  const [unreadUserNotifications, setUnreadUserNotifications] = useState(false);
  const [everyPostId, setEveryPostId] = useState();
  const [messages, setMessages] = useState({});
  const [randomPostButtonDisabled, setRandomPostButtonDisabled] =
    useState(false);

  const randomPostButtonClick = () => {
    setRandomPostButtonDisabled(true);
    setTimeout(() => {
      setRandomPostButtonDisabled(false);
    }, 500);
  };

  useEffect(() => {
    fetch(API_BASE + "/api/user", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        setUser(res.user);
        setEveryPostId(res.everyPostId);
        setUserNotifications(res.notifications);
        setUnreadUserNotifications(
          res.notifications.some((notification) => !notification.read)
        );
      });
  }, []);

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMessages({});
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  // Update the user every 1 minute to update notifications and everyPostId for random post button
  const MINUTE_MS = 60000;
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(API_BASE + "/api/user", { credentials: "include" })
        .then((res) => res.json())
        .then((res) => {
          setUser(res.user);
          setUserNotifications(res.notifications);
          setEveryPostId(res.everyPostId);
          setUnreadUserNotifications(
            res.notifications.some((notification) => !notification.read)
          );
        });
    }, MINUTE_MS);
    return () => clearInterval(interval);
  }, []);

  const randomPostId = () => {
    const randomNum = Math.floor(Math.random() * everyPostId.length);
    return everyPostId[randomNum];
  };

  return (
    <div className="bg-base-200 pb-20 min-h-screen">
      {/* If logged in, display the top navbar */}
      {user ? (
        <header className="navbar bg-accent text-neutral-content sticky top-0 z-20">
          {/* Logout button */}
          <Link
            to={user ? "/logout" : "/"}
            className="btn btn-ghost btn-circle"
          >
            <img
              src={logout}
              className="w-10"
              alt="Create add icon. Add icons created by srip - Flaticon"
            ></img>
          </Link>
          {/* Brunchy logo and link to profile */}
          <Link
            to={user ? `/profile/${user._id}` : "/"}
            className="flex font-bold btn btn-ghost py-0 px-2"
          >
            <img
              src={brunchy}
              className=" w-12"
              alt="Brunchy person and toast holding hands icon. Brunch icons created by paulalee - Flaticon"
            ></img>
            <h1 className="ml-2 text-neutral self-center">Brunchy</h1>
          </Link>
          {/* Notifications button */}
          <Link
            to={user ? "/notifications" : "/"}
            className="btn btn-ghost btn-circle"
          >
            <img
              src={
                unreadUserNotifications
                  ? notificationsActive
                  : notificationsInactive
              }
              className="w-10"
              alt="Notification bell icon. Notification bell icons created by Valter Bispo - Flaticon"
            ></img>
          </Link>
        </header>
      ) : null}
      {/* If logged in, display the bottom nav bar */}
      {user ? (
        <div className="menu btm-nav bg-accent z-20">
          {/* Feed button */}
          <Link to={user ? "/feed" : "/"} className="w-1/5 btn btn-ghost">
            <img
              src={feed}
              className="w-10"
              alt="Feed Brunch plate icon. Brunch icons created by Eucalyp - Flaticon"
            ></img>
            {/* <span className="flex text-neutral normal-case">Feed</span> */}
          </Link>
          {/* Search button */}
          <Link
            to={user ? `/search` : "/"}
            className="text-primary w-1/5 btn btn-ghost"
          >
            <img
              src={search}
              className=" w-10"
              alt="Search magnifying glass icon. Search icons created by Good Ware - Flaticon"
            ></img>
            {/* <span className="text-neutral normal-case">Search</span> */}
          </Link>
          {/* Random post button? */}
          <Link
            to={user && everyPostId ? `/post/${randomPostId()}` : "/"}
            className="text-primary w-1/5 btn btn-ghost"
            disabled={randomPostButtonDisabled}
            onClick={randomPostButtonClick}
          >
            <img
              src={random}
              className=" w-10"
              alt="Random mystery box icon. Random icons created by noomtah - Flaticon"
            ></img>
            {/* <span className="text-neutral normal-case">Random</span> */}
          </Link>
          {/* Saved Posts button */}
          <Link to={user ? `/saved` : "/"} className="w-1/5 btn btn-ghost">
            <img
              src={saved}
              className=" w-10"
              alt="Saved posts star icon. Star icons created by Freepik - Flaticon"
            ></img>
            {/* <span className="text-neutral normal-case">Saved</span> */}
          </Link>
          {/* Profile button */}
          <Link
            to={user ? `/profile/${user._id}` : "/"}
            className="text-primary w-1/5 btn btn-ghost"
          >
            <img
              src={profileSketch}
              className=" w-10"
              alt="Profile sketch person eating brunch. Brunch icons created by paulalee - Flaticon"
            />
            {/* <span className="text-neutral normal-case">Profile</span> */}
          </Link>
        </div>
      ) : null}
      <Messages messages={messages} />
      <ToastContainer className="top-16" position="top-left" autoClose={2000} />
      <Outlet
        context={{
          user,
          setUser,
          setMessages,
          setEveryPostId,
          userNotifications,
          setUserNotifications,
          unreadUserNotifications,
          setUnreadUserNotifications,
        }}
      />
    </div>
  );
}
