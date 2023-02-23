import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "flowbite";
import "../style.css";
import Messages from "../components/Messages";
import { API_BASE } from "../constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import brunchy from "../images/brunchy-color.png";
import feed from "../images/feed-color.png";
import search from "../images/search-color.png";
import random from "../images/random-color.png";
import saved from "../images/saved-color.png";
import notification from "../images/notification-color.png";
import create from "../images/create-color.png";
import profileSketch from "../images/profile-sketch-color.png";
import logout from "../images/logout-color.png";

export default function Root() {
  const [user, setUser] = useState();
  const [messages, setMessages] = useState({});

  useEffect(() => {
    fetch(API_BASE + "/api/user", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => setUser(res.user));
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

  return (
    <div className="bg-base-200 pb-20 min-h-screen">
      {/* If logged in, display the top navbar */}
      {user ? (
        <header className="navbar bg-accent text-neutral-content sticky top-0 z-10">
          {/* Brunchy logo and link to profile */}
          <Link to={user ? "/profile" : "/"} className="flex">
            <button className="font-bold btn btn-ghost py-0 px-2">
              <img
                src={brunchy}
                className=" w-12"
                alt="Brunchy person and toast holding hands icon. Brunch icons created by paulalee - Flaticon"
              ></img>
              <h1 className="ml-2 text-neutral self-center">Brunchy</h1>
            </button>
          </Link>
          <div className="navbar-end">
            {/* Logout button */}
            <Link to={user ? "/logout" : "/"}>
              <button className="btn btn-ghost btn-circle mx-3">
                <img
                  src={logout}
                  className="w-10"
                  alt="Create add icon. Add icons created by srip - Flaticon"
                ></img>
              </button>
            </Link>
            {/* Notifications button */}
            <Link to={user ? "/feed" : "/"}>
              <button className="btn btn-ghost btn-circle mx-1">
                <div className="indicator">
                  <img
                    src={notification}
                    className="w-10"
                    alt="Notification bell icon. Notification bell icons created by Valter Bispo - Flaticon"
                  ></img>
                  <span className="badge badge-xs badge-primary indicator-item"></span>
                </div>
              </button>
            </Link>
          </div>
        </header>
      ) : null}
      {/* If logged in, display the bottom nav bar */}
      {user ? (
        <div className="menu btm-nav bg-accent z-10">
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
            to={user ? "/profile" : "/"}
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
            to={user ? "/feed" : "/"}
            className="text-primary w-1/5 btn btn-ghost"
          >
            <img
              src={random}
              className=" w-10"
              alt="Random mystery box icon. Random icons created by noomtah - Flaticon"
            ></img>
            {/* <span className="text-neutral normal-case">Random</span> */}
          </Link>
          {/* Saved Posts button */}
          <Link
            to={user ? "/profile" : "/"}
            className="text-primary w-1/5 btn btn-ghost"
          >
            <img
              src={saved}
              className=" w-10"
              alt="Saved posts star icon. Star icons created by Freepik - Flaticon"
            ></img>
            {/* <span className="text-neutral normal-case">Saved</span> */}
          </Link>
          {/* Profile button */}
          <Link
            to={user ? "/profile" : "/"}
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
      <Outlet context={{ user, setUser, setMessages }} />
    </div>
  );
}
