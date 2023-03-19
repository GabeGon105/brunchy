import { useEffect, useState, useRef } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { API_BASE } from "../constants";
import Comment from "../components/Comment";
import UsersList from "../components/UsersList";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageCarousel from "../components/ImageCarousel";
import edit from "../images/edit-color.png";
import savedColor from "../images/saved-color.png";
import savedNoColor from "../images/saved.png";
import likeColor from "../images/like-color.png";
import likeNoColor from "../images/like-no-color.png";

export default function Post() {
  const { user, setEveryPostId } = useOutletContext();
  const postId = useParams().id;
  const navigate = useNavigate();

  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState();
  const [save, setSave] = useState();
  const [postUserId, setPostUserId] = useState();
  const [postUserName, setPostUserName] = useState();
  const [likesUsersArr, setLikesUsersArr] = useState([]);
  const [checkedState, setCheckedState] = useState(new Array(3).fill(false));

  const handlePostTypeChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  // call a click event to close the Edit Post drop-down, and call a click event to close the Edit/Delete post modal when the Sumbit Edit Post button is clicked
  const editPostRef = useRef(null);
  const editDeletePostRef = useRef(null);
  const handleClick = () => {
    // If no "type" checkboxes are checked, return an error toast
    if (checkedState.some((state) => state)) {
      editPostRef.current.click();
      editDeletePostRef.current.click();
    } else {
      toast.error('Please select at least one "type" checkbox');
    }
  };

  useEffect(() => {
    fetch(API_BASE + `/api/post/${postId}`, { credentials: "include" })
      .then((res) => res.json())
      .then(
        ({
          post,
          comments,
          like,
          save,
          postUserId,
          postUserName,
          likesUsersArr,
          everyPostId,
        }) => {
          // use the post.createdAt property to calculate the current date and assign this value to post.date
          const dateArray = new Date(post.createdAt).toString().split(" ");
          const date = `${dateArray[2]} ${dateArray[1]}, ${dateArray[3]}`;
          post.date = date;

          setPost(post);
          setEveryPostId(everyPostId);
          setComments(comments);
          // if the post has been liked by the current user like will exist, else it will not exist and like will be false
          setLike(like.length > 0);
          // if the post has been saved by the current user save will exist, else it will not exist and save will be false
          setSave(save.length > 0);
          setPostUserId(postUserId);
          setLikesUsersArr(likesUsersArr);
          setPostUserName(postUserName);
          setCheckedState([
            post.type.includes("Brunch"),
            post.type.includes("Breakfast"),
            post.type.includes("Bakery"),
          ]);
        }
      );
  }, [setPost, postId]);

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

  if (post === undefined) return null;
  else if (post === null) return <h2>Post not found</h2>;

  const handleLike = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      credentials: "include",
    });
    const res = await response.json();
    const change = res.change;
    const likesUsersArr = res.likesUsersArr;
    setPost({ ...post, likes: post.likes + change });
    setLikesUsersArr(likesUsersArr);
    setLike(!like);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      credentials: "include",
    });
    const json = await response.json();
    // If there is a success message after saving a post, send a toastify success alert
    if (json.messages) {
      json.messages.success.map((el) => toast.success(el.msg));
    }
    setSave(!save);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      credentials: "include",
    });
    const json = await response.json();
    if (json.messages) {
      // setMessages(json.messages);
      // React toastify success message
      json.messages.success.map((el) => toast.success(el.msg));
    }
    navigate(`/profile/${user._id}`);
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      body: new URLSearchParams(new FormData(form)),
      credentials: "include",
    });

    const json = await response.json();

    // If there is a success message after editing a post, send a toastify success alert
    if (json.messages) {
      json.messages.success.map((el) => toast.success(el.msg));
    }

    // Spread out the previous post state, update the title, naverLink, and caption, then setPost
    setPost({
      ...post,
      title: json.updatedPost.title,
      naverLink: json.updatedPost.naverLink,
      caption: json.updatedPost.caption,
      type: json.updatedPost.type,
      edited: json.updatedPost.edited,
    });
    form.reset();
  };

  const handleAddComment = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      body: new URLSearchParams(new FormData(form)),
      credentials: "include",
    });
    const comment = await response.json();
    setComments([...comments, comment]);
    form.reset();
  };

  const deleteComment = async (id, event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      body: new URLSearchParams(new FormData(form)),
      credentials: "include",
    });

    const json = await response.json();
    // If there is a success message after editing a post, send a toastify success alert
    if (json.messages) {
      json.messages.success.map((el) => toast.success(el.msg));
    }
    // Filter out the deleted comment and res-set the comments to re-render
    const newComments = comments.filter((comment) => comment._id !== id);
    setComments(newComments);
  };

  const updateComment = async (id, event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      body: new URLSearchParams(new FormData(form)),
      credentials: "include",
    });

    const json = await response.json();

    // If there is a success message after editing a comment, send a toastify success alert
    if (json.messages) {
      json.messages.success.map((el) => toast.success(el.msg));
    }
    // Map through comments to create an array with all comments and replacing the old comment with the new edited comment
    const newComments = comments.map((comment) =>
      comment._id === id ? json.updatedComment : comment
    );
    setComments(newComments);
    form.reset();
  };

  const postTypeBadgeDictionary = {
    Brunch: "primary",
    Breakfast: "secondary",
    Bakery: "accent",
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-3 sm:w-5/6 md:w-3/4 lg:w-2/3 xl-1/2 mx-auto">
        {/* Post title, Delete, post, and Naver/Kakao map link */}
        <div className="text-center mb-3 justify-center">
          <div className="flex justify-center">
            <div className="w-16 md:w-12"></div>
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral break-words self-center md:w-3/4">
              {post.title}
            </h2>
            {/* If the post user's id matches the current user, allow the user to edit the post */}
            <div className="">
              {post.user === user._id ? (
                <>
                  {/* The button to open modal */}
                  <label
                    htmlFor={`modal-${post.id}`}
                    className="ml-2 w-10 btn btn-ghost text-lg p-0"
                  >
                    <img
                      src={edit}
                      className="w-8 md:w-10"
                      alt="Edit icons created by Freepik - Flaticon"
                    ></img>
                  </label>

                  {/* Put this part before </body> tag */}
                  <input
                    type="checkbox"
                    id={`modal-${post.id}`}
                    className="modal-toggle"
                  />
                  <label
                    htmlFor={`modal-${post.id}`}
                    className="modal modal-bottom sm:modal-middle cursor-pointer"
                    ref={editDeletePostRef}
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
                              action={`/api/post/deletePost/${post._id}?_method=DELETE`}
                              method="POST"
                              onSubmit={handleDelete}
                            >
                              <button
                                className="btn btn-error w-52 text-neutral"
                                type="submit"
                              >
                                Delete post
                              </button>
                            </form>
                          </li>
                          <li className="flex flex-col items-center mt-4 w-full">
                            {/* Collapsable form */}
                            <button
                              className="btn btn-accent w-52 text-neutral"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#editPost-${post.id}-formCollapse`}
                              aria-expanded="true"
                              aria-controls={`editPost-${post.id}-formCollapse`}
                              ref={editPostRef}
                            >
                              Edit Post
                            </button>
                            <div
                              className="collapse w-full"
                              id={`editPost-${post.id}-formCollapse`}
                            >
                              <div className="mt-2 rounded-lg bg-base-100 my-3 flex flex-col items-center">
                                {/* Edit post update form */}
                                <form
                                  action={`/api/post/editPost/${postId}?_method=PATCH`}
                                  method="POST"
                                  className="flex flex-col items-center mt-2 w-full"
                                  onSubmit={handleEdit}
                                >
                                  {/* Location name edit */}
                                  <div className="w-3/4 md:flex md:flex-col mb-3">
                                    <label
                                      className="label text-neutral"
                                      htmlFor="title"
                                    >
                                      Location name:
                                    </label>
                                    <input
                                      type="text"
                                      required
                                      maxLength="50"
                                      defaultValue={post.title}
                                      className="input input-bordered input-primary w-full"
                                      id="title"
                                      name="title"
                                    />
                                  </div>
                                  {/* Naver Maps link edit */}
                                  <div className="w-3/4 md:flex md:flex-col mb-3">
                                    <label
                                      className="label text-neutral"
                                      htmlFor="naverLink"
                                    >
                                      Naver Maps link:
                                    </label>
                                    <input
                                      type="text"
                                      required
                                      maxLength="100"
                                      defaultValue={post.naverLink}
                                      className="input input-bordered input-primary w-full"
                                      id="naverLink"
                                      name="naverLink"
                                    />
                                  </div>
                                  {/* Breakfast, Brunch, Bakery type edit */}
                                  <div className="w-3/4 mb-3">
                                    <h3 className="text-neutral">
                                      What type of place is this?
                                    </h3>
                                    <span className="text-sm">
                                      (Choose at least 1)
                                    </span>
                                    <div className="">
                                      <label
                                        className="label text-cyan-500 cursor-pointer font-semibold"
                                        htmlFor="brunch"
                                      >
                                        Brunch
                                        <input
                                          type="checkbox"
                                          className="checkbox checkbox-primary"
                                          id="brunch"
                                          name="type"
                                          value="Brunch"
                                          checked={checkedState[0]}
                                          onChange={() =>
                                            handlePostTypeChange(0)
                                          }
                                        />
                                      </label>
                                    </div>
                                    <div className="">
                                      <label
                                        className="label text-rose-300 cursor-pointer font-semibold"
                                        htmlFor="breakfast"
                                      >
                                        Breakfast
                                        <input
                                          type="checkbox"
                                          className="checkbox checkbox-secondary"
                                          id="breakfast"
                                          name="type"
                                          value="Breakfast"
                                          checked={checkedState[1]}
                                          onChange={() =>
                                            handlePostTypeChange(1)
                                          }
                                        />
                                      </label>
                                    </div>
                                    <div className="">
                                      <label
                                        className="label text-accent cursor-pointer font-semibold"
                                        htmlFor="bakery"
                                      >
                                        Bakery
                                        <input
                                          type="checkbox"
                                          className="checkbox checkbox-accent"
                                          id="bakery"
                                          name="type"
                                          value="Bakery"
                                          checked={checkedState[2]}
                                          onChange={() =>
                                            handlePostTypeChange(2)
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  {/* Location description edit */}
                                  <div className="w-3/4 md:flex md:flex-col mb-3">
                                    <label
                                      className="label text-neutral"
                                      htmlFor="caption"
                                    >
                                      Description:
                                    </label>
                                    <textarea
                                      required
                                      maxLength="2000"
                                      rows="5"
                                      className="textarea textarea-primary w-full"
                                      defaultValue={post.caption}
                                      id="caption"
                                      name="caption"
                                    ></textarea>
                                  </div>
                                  <button
                                    type="submit"
                                    className="btn btn-primary w-52"
                                    value="Upload"
                                    // If at least one of the type checkboxes are checked, fire the handleClick method, else send an error toast
                                    onClick={handleClick}
                                  >
                                    Submit edit
                                  </button>
                                </form>
                              </div>
                            </div>
                          </li>
                        </ul>
                        <div className="modal-action flex justify-center mt-3">
                          <label
                            htmlFor={`modal-${post.id}`}
                            className="underline  text-neutral cursor-pointer"
                          >
                            Cancel
                          </label>
                        </div>
                      </div>
                    </label>
                  </label>
                </>
              ) : (
                <div className="ml-2 w-10 p-0"></div>
              )}
            </div>
          </div>
          <a
            className="text-sm md:text-base text-neutral break-words link link-primary"
            href={post.naverLink}
            target="/blank"
          >
            Find me on Naver or Kakao :)
          </a>
        </div>
        {/* Post "types" and post images */}
        <div className="sm:w-5/6 md:w-3/4 lg:w-2/3 xl-1/2 flex flex-col items-center">
          {/* Post "types" badges */}
          <div className="w-3/4 mb-2 flex justify-center">
            {post.type.map((type, i) => {
              return (
                <div key={i} className="w-1/3 flex justify-center">
                  <span
                    className={`text-neutral badge badge-outline badge-${postTypeBadgeDictionary[type]}`}
                  >
                    {type}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Image Carousel with post images */}
          <ImageCarousel
            key={post._id}
            images={post.image}
            caption={post.caption}
            className="max-h-96"
          />
        </div>
        {/* Like and Save post buttons */}
        <div className="row justify-evenly mt-1 mb-2">
          <form
            className="col-1 w-28 justify-center"
            action={`/api/post/likePost/${post._id}?_method=PUT`}
            method="POST"
            onSubmit={handleLike}
          >
            <button className="w-20 btn btn-ghost" type="submit">
              {/* If the photo is liked by the current user, display a color photo, else display a colorless photo */}
              <img
                src={like ? likeColor : likeNoColor}
                className="w-10"
                alt="Heart like icon. Heart icons created by Freepik - Flaticon"
              ></img>
            </button>
          </form>
          {/* Add/delete the post id from the user's savedPosts */}
          <form
            className="col-2 w-28"
            action={`/api/post/savePost/${post._id}?_method=PUT`}
            method="POST"
            onSubmit={handleSave}
          >
            <button className="w-20 btn btn-ghost" type="submit">
              <img
                src={save ? savedColor : savedNoColor}
                className="w-10"
                alt="Star saved icon. Star icons created by Freepik - Flaticon"
              ></img>
            </button>
          </form>
        </div>
        <div className="sm:w-5/6 md:w-3/4 lg:w-2/3 xl-1/2">
          {/* If number of likes is less than 1 set the likes count to invisibile */}
          <div className={`text-neutral ${post.likes < 1 ? "hidden" : ""}`}>
            {/* The button to open users likes modal */}
            <label
              htmlFor={`modal-${post.id}-likes`}
              className="text-neutral hover:text-cyan-500 cursor-pointer"
            >
              {/* if number of likes is greater than 1 display likes plural, else display singular */}
              {post.likes !== 1
                ? `${post.likes} people like this`
                : `${post.likes} person likes this`}
            </label>

            {/* Put this part before </body> tag */}
            <input
              type="checkbox"
              id={`modal-${post.id}-likes`}
              className="modal-toggle"
            />
            <label
              htmlFor={`modal-${post.id}-likes`}
              className="modal modal-bottom sm:modal-middle cursor-pointer"
            >
              <label className="modal-box relative" htmlFor="">
                <div>
                  <h3 className="text-neutral font-semibold text-center mb-2">
                    {likesUsersArr.length === 1
                      ? `${likesUsersArr.length} Like`
                      : `${likesUsersArr.length} Likes`}
                  </h3>
                  <UsersList usersArr={likesUsersArr} />
                  <div className="modal-action flex justify-center mt-3">
                    <label
                      htmlFor={`modal-${post.id}-likes`}
                      className="underline  text-neutral cursor-pointer"
                    >
                      Close
                    </label>
                  </div>
                </div>
              </label>
            </label>
          </div>

          {/* Likes, username, and post caption */}
          <div className="flex flex-col mt-2">
            <p className="text-neutral break-words whitespace-pre-line">
              <Link to={`/profile/${postUserId}`}>
                <span className="text-neutral break-words font-bold mr-1 hover:text-cyan-500">
                  {postUserName}
                </span>
              </Link>
              {post.caption}
            </p>
            <div className="mt-2">
              <span className="text-neutral text-sm mr-1">{post.date}</span>
              {post.edited && (
                <span className="text-neutral text-sm">• Edited</span>
              )}
            </div>
          </div>
          {/* Comment count and comments */}
          <div className="my-4">
            <p
              className={`text-neutral ${comments.length < 1 ? "hidden" : ""}`}
            >
              {/* if length of comments is greater than 1 display comments plural, else display singular */}
              {comments.length !== 1
                ? `${comments.length} comments:`
                : `${comments.length} comment:`}
            </p>
            <ul>
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  depth={0}
                  postId={post._id}
                  currentUserId={user._id}
                  postUserId={postUserId}
                  deleteComment={deleteComment}
                  updateComment={updateComment}
                />
              ))}
            </ul>
          </div>
          {/* Post comments section */}
          <div className="">
            <form
              action={"/api/comment/createComment/" + post._id}
              method="POST"
              onSubmit={handleAddComment}
              className="flex flex-col items-center md:items-start my-3 "
            >
              <textarea
                className="textarea textarea-accent w-full"
                name="text"
                required
                maxLength="600"
                rows="3"
                placeholder="Add a comment..."
              ></textarea>
              <button
                type="submit"
                className="btn btn-primary mt-3 w-52"
                value="Upload"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
