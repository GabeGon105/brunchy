import { useRef } from "react";
import { Link } from "react-router-dom";

const Notification = ({ notification, handleRead, handleDelete }) => {
  const messageDictionary = {
    follow: " started following you!",
    like: " liked your post!",
    comment: " commented on your post!",
  };

  // call a click event to click the notification button and submit the readNotification form action
  const readNotificationRef = useRef(null);
  const handleReadClick = () => {
    readNotificationRef.current.click();
  };

  return (
    <li className="flex flex-col items-center w-full">
      <div
        className={`flex items-center space-x-3 w-full md:w-5/6 hover:bg-accent hover:opacity-80 rounded ${
          notification.read ? "bg-base-100" : "bg-orange-200"
        }`}
      >
        <form
          className="flex w-full h-20 items-center"
          action={`/api/notifications/read/${notification._id}?_method=PATCH`}
          method="POST"
          onSubmit={handleRead}
          onClick={handleReadClick}
        >
          <button
            className="flex w-full h-20 items-center space-x-3 text-left"
            type="submit"
            ref={readNotificationRef}
          >
            <div className="avatar pl-2 sm:pl-10 lg:pl-14 xl:pl-20">
              <div className="w-12 rounded-full hover:opacity-50">
                <Link to={`/profile/${notification.user}`}>
                  <img
                    src={notification.userImage}
                    alt={`User photo of ${notification.userName}`}
                  />
                </Link>
              </div>
            </div>
            <Link
              to={
                notification.type === "follow"
                  ? `/profile/${notification.user}`
                  : `/post/${notification.postId}`
              }
              className="flex w-full h-20 items-center"
            >
              <div
                className={`text-neutral ${
                  notification.type === "follow" ? `w-full` : `w-4/5`
                }`}
              >
                <p className="text-neutral">
                  <span className="font-bold">{notification.userName}</span>
                  {messageDictionary[notification.type]}
                </p>
                <span className="text-sm text-neutral opacity-50">
                  {notification.date}
                </span>
              </div>
              <div className="avatar">
                {notification.type !== "follow" && (
                  <div className="w-12 h-min h-max">
                    <img
                      src={notification.postImage}
                      alt={`User photo of ${notification.userName}`}
                    />
                  </div>
                )}
              </div>
            </Link>
          </button>
        </form>
        <form
          className=""
          action={`/api/notifications/delete/${notification._id}?_method=DELETE`}
          method="POST"
          onSubmit={handleDelete}
        >
          <button className="btn btn-xs btn-secondary btn-circle btn-outline mr-2 sm:mr-4 lg:mr-5 xl:mr-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </form>
      </div>
    </li>
  );
};

export default Notification;
