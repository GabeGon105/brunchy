import { useRef } from "react";
import { Link } from "react-router-dom";
export default function Comment({
  postId,
  currentUserId,
  comment,
  deleteComment,
  updateComment,
  postUserId,
}) {
  // call a click event to close the Edit Comment drop-down, and call a click event to close the Edit/Delete comment modal when the Sumbit Edit Comment button is clicked
  const editCommentRef = useRef(null);
  const editDeleteCommentRef = useRef(null);
  const handleClick = () => {
    editCommentRef.current.click();
    editDeleteCommentRef.current.click();
  };
  return (
    <div className="chat chat-start" id={comment._id}>
      <div className="chat-image avatar">
        <div className="w-12 rounded-full">
          <Link to={`/profile/${comment.userId}`}>
            <img
              src={comment.userImage}
              alt="user profile photo"
              className="hover:opacity-50"
            />
          </Link>
        </div>
      </div>
      <div className="chat-header text-neutral break-words flex">
        <Link to={`/profile/${comment.userId}`}>
          <span className="text-base self-end hover:text-cyan-500">
            {comment.userName}
          </span>
        </Link>
        {/* <time className="text-xs opacity-50">12:45</time> */}

        {/* If the comment user's id matches the current user OR if the post user's id matches the current user, allow the user to delete the comment */}
        <div className="">
          {!comment.deleted &&
          (comment.userId === currentUserId || postUserId === currentUserId) ? (
            <>
              {/* The button to open modal */}
              <label
                htmlFor={`modal-${comment._id}`}
                className="ml-2 btn btn-sm btn-ghost text-lg pt-0"
              >
                ...
              </label>

              {/* Put this part before </body> tag */}
              <input
                type="checkbox"
                id={`modal-${comment._id}`}
                className="modal-toggle"
              />
              <label
                htmlFor={`modal-${comment._id}`}
                className="modal modal-bottom sm:modal-middle cursor-pointer"
                ref={editDeleteCommentRef}
              >
                <label className="modal-box relative" htmlFor="">
                  <div>
                    <ul
                      className="flex flex-col items-center"
                      role="group"
                      aria-label="Comment Actions"
                    >
                      <li className="">
                        <form
                          action={`/api/comment/deleteComment/${postId}/${comment._id}?_method=DELETE`}
                          method="POST"
                          onSubmit={deleteComment.bind(null, comment._id)}
                        >
                          <button
                            className="btn btn-error w-52 text-neutral"
                            type="submit"
                          >
                            Delete comment
                          </button>
                        </form>
                      </li>
                      {/* If the comment user's id matches the current user's id, allow the user to edit the comment */}
                      {comment.userId === currentUserId ? (
                        <li className="flex flex-col items-center mt-4 w-full">
                          {/* Collapsable form */}
                          <button
                            className="btn btn-accent w-52 text-neutral"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#editComment-${comment._id}-formCollapse`}
                            aria-expanded="true"
                            aria-controls={`editComment-${comment._id}-formCollapse`}
                            ref={editCommentRef}
                          >
                            Edit comment
                          </button>
                          <div
                            className="collapse w-full"
                            id={`editComment-${comment._id}-formCollapse`}
                          >
                            <div className="mt-2 rounded-lg bg-base-100 my-3 flex flex-col items-center">
                              {/* <p className="w-3/4 text-center text-neutral font-semibold">
                              Previous comment:{" "}
                              <span className="text-neutral font-normal">
                                {comment.text}
                              </span>
                            </p> */}
                              {/* Edit comment upload form */}
                              <form
                                action={`/api/comment/editComment/${postId}/${comment._id}?_method=PATCH`}
                                method="POST"
                                onSubmit={updateComment.bind(null, comment._id)}
                                className="flex flex-col items-center mt-2 w-full"
                              >
                                {/* Flex container for text area input */}
                                <div className="w-3/4 md:flex mb-3">
                                  <textarea
                                    className="textarea textarea-primary w-full text-neutral"
                                    required
                                    rows="3"
                                    id="text"
                                    name="text"
                                    defaultValue={comment.text}
                                  ></textarea>
                                </div>

                                {/* Edit comment submit button */}
                                <button
                                  type="submit"
                                  className="btn btn-primary w-52 text-neutral"
                                  value="Upload"
                                  onClick={handleClick}
                                >
                                  Submit edit
                                </button>
                              </form>
                            </div>
                          </div>
                        </li>
                      ) : null}
                    </ul>
                    <div className="modal-action flex justify-center mt-3">
                      <label
                        htmlFor={`modal-${comment._id}`}
                        className="underline  text-neutral cursor-pointer"
                      >
                        Cancel
                      </label>
                    </div>
                  </div>
                </label>
              </label>
            </>
          ) : null}
        </div>
      </div>
      {!comment.deleted ? (
        <p className="chat-bubble bg-accent text-neutral break-words">
          {comment.text}
        </p>
      ) : null}

      {/* <div className="chat-footer opacity-50">Delivered</div> */}
      <div className="chat-footer text-xs">
        {comment.edited ? "Edited" : null}
      </div>
    </div>
  );
}
