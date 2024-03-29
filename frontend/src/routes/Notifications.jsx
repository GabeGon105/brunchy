import { useEffect, useState, useRef } from "react";
import { useOutletContext, Link } from "react-router-dom";
import Notification from "../components/Notification";
import { API_BASE } from "../constants";
import trash from "../images/trash-color.png";
import read from "../images/read.png";
import { toast } from "react-toastify";

export default function Notifications() {
  const {
    user,
    setUser,
    userNotifications,
    setUserNotifications,
    setUnreadUserNotifications,
  } = useOutletContext();
  const [readAllButtonDisabled, setReadAllButtonDisabled] = useState(false);
  const [deleteAllButtonDisabled, setDeleteAllButtonDisabled] = useState(false);

  const readAllButtonClick = () => {
    setReadAllButtonDisabled(true);
    setTimeout(() => {
      setReadAllButtonDisabled(false);
    }, 500);
  };
  const deleteAllButtonClick = () => {
    setDeleteAllButtonDisabled(true);
    setTimeout(() => {
      setDeleteAllButtonDisabled(false);
    }, 500);
  };

  useEffect(() => {
    toast.promise(
      fetch(API_BASE + "/api/notifications", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(({ updatedUser, notifications }) => {
          setUser(updatedUser);
          if (notifications.length) {
            setUserNotifications(notifications);
            setUnreadUserNotifications(
              notifications.some((notification) => !notification.read)
            );
          }
        }),
      // React toast promise
      {
        pending: "Loading notifications...",
        error: "Uh-oh. We couldn't load notifications 🤯",
      }
    );
  }, []);

  if (!user)
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-neutral text-center text-xl mt-8">
          Whoa there, fella...
        </h1>
        <p className="text-neutral text-center">
          Head back to the login page, quick!
        </p>
        <Link to="/" className="btn btn-primary shadow-md w-52 mt-4">
          Login Page
        </Link>
      </div>
    );

  const handleRead = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      credentials: "include",
    });

    const json = await response.json();

    setUser(json.updatedUser);
    setUserNotifications(json.updatedNotifications);
    setUnreadUserNotifications(
      json.updatedNotifications.some((notification) => !notification.read)
    );
  };

  const handleReadAll = async (event) => {
    readAllButtonClick();
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      credentials: "include",
    });

    const json = await response.json();
    setUserNotifications(json.updatedNotifications);
    setUnreadUserNotifications(
      json.updatedNotifications.some((notification) => !notification.read)
    );
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      credentials: "include",
    });

    const json = await response.json();
    setUserNotifications(json.updatedNotifications);
    setUnreadUserNotifications(
      json.updatedNotifications.some((notification) => !notification.read)
    );
  };

  const handleDeleteAll = async (event) => {
    deleteAllButtonClick();
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      credentials: "include",
    });

    const json = await response.json();
    setUser(json.updatedUser);
    setUserNotifications(json.updatedNotifications);
    setUnreadUserNotifications(
      json.updatedNotifications.some((notification) => !notification.read)
    );
  };

  return (
    <div className="container w-full md:w-5/6 xl:w-2/3 mx-auto mt-4">
      <div className="flex mb-2">
        <form
          className="w-1/4 flex justify-center"
          action={`/api/notifications/readAll?_method=PATCH`}
          method="POST"
          onSubmit={handleReadAll}
        >
          <button
            className="w-24 h-full btn btn-ghost"
            type="submit"
            disabled={readAllButtonDisabled}
          >
            <img
              src={read}
              className="w-8"
              alt="Star saved icon. Star icons created by Freepik - Flaticon"
            ></img>
            <span className="normal-case text-xs w-full">Mark read</span>
          </button>
        </form>
        <h3 className="w-1/2 text-neutral text-xl font-semibold text-center mb-3">
          Notifications
        </h3>
        <form
          className="w-1/4 flex justify-center"
          action={`/api/notifications/deleteAll?_method=DELETE`}
          method="POST"
          onSubmit={handleDeleteAll}
        >
          <button
            className="w-24 h-full btn btn-ghost"
            type="submit"
            disabled={deleteAllButtonDisabled}
          >
            <img
              src={trash}
              className="w-8"
              alt="Star saved icon. Star icons created by Freepik - Flaticon"
            ></img>
            <span className="normal-case text-xs w-full">Delete all</span>
          </button>
        </form>
      </div>
      {/* If there are no notifications, display a
      no posts message */}
      {user && userNotifications && (
        <ul
          className="flex flex-col items-center"
          role="group"
          aria-label="Notification List"
        >
          {userNotifications.map((currentNotification, index) => {
            return (
              <Notification
                key={`notification-${currentNotification._id}`}
                notification={currentNotification}
                handleRead={handleRead}
                handleDelete={handleDelete}
                index={index}
              />
            );
          })}
        </ul>
      )}
      {user.notifications.length === 0 && (
        <p className="text-neutral text-center mt-5">
          ʕ•ᴥ•ʔ <br />
          No new notifications to show
        </p>
      )}
    </div>
  );
}
