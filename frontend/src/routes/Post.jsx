import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { API_BASE } from "../constants";
import Comment from "../components/Comment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageCarousel from "../components/ImageCarousel";
import trash from "../images/trash-color.png";
import savedColor from "../images/saved-color.png";
import savedNoColor from "../images/saved.png";
import likeColor from "../images/like-color.png";
import likeNoColor from "../images/like-no-color.png";

export default function Post() {
  const { user } = useOutletContext();
  const postId = useParams().id;
  const navigate = useNavigate();

  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState();
  const [save, setSave] = useState();

  useEffect(() => {
    fetch(API_BASE + `/api/post/${postId}`, { credentials: "include" })
      .then((res) => res.json())
      .then(({ post, comments, like, save }) => {
        setPost(post);
        setComments(comments);
        // if the post has been liked by the current user like will exist, else it will not exist and like will be false
        setLike(like.length > 0);
        // if the post has been saved by the current user save will exist, else it will not exist and save will be false
        setSave(save.length > 0);
      });
  }, [setPost, postId]);

  if (!user) return null;

  if (post === undefined) return null;
  else if (post === null) return <h2>Post not found</h2>;

  const handleLike = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      credentials: "include",
    });
    const change = await response.json();
    setPost({ ...post, likes: post.likes + change });
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
    navigate(-1);
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
    const newComments = JSON.parse(JSON.stringify(comments));
    const commentArrays = new Map();
    for (const comment of newComments)
      commentArrays.set(comment.id, newComments);

    const queue = [...newComments];
    while (queue.length) {
      const comment = queue.shift();
      if (comment.id === id) {
        event.preventDefault();
        const form = event.currentTarget;
        const response = await fetch(API_BASE + form.getAttribute("action"), {
          method: form.method,
          body: new URLSearchParams(new FormData(form)),
          credentials: "include",
        });
        const deletedComment = await response.json();
        if (deletedComment) {
          Object.assign(comment, deletedComment);
        } else {
          const array = commentArrays.get(comment.id);
          array.splice(array.indexOf(comment), 1);
        }
        break;
      }
      for (const subComment of comment.comments) {
        queue.push(subComment);
        commentArrays.set(subComment.id, comment.comments);
      }
    }

    setComments(newComments);
  };

  const updateComment = async (id, event) => {
    const newComments = JSON.parse(JSON.stringify(comments));

    const queue = [...newComments];
    while (queue.length) {
      const comment = queue.shift();
      if (comment.id === id) {
        event.preventDefault();
        const form = event.currentTarget;
        const response = await fetch(API_BASE + form.getAttribute("action"), {
          method: form.method,
          body: new URLSearchParams(new FormData(form)),
          credentials: "include",
        });
        Object.assign(comment, await response.json());
        form.querySelector("[data-bs-dismiss]").click();
        break;
      }
      for (const subComment of comment.comments) {
        queue.push(subComment);
      }
    }

    setComments(newComments);
  };

  const addComment = async (id, event) => {
    const newComments = JSON.parse(JSON.stringify(comments));

    const queue = [...newComments];
    while (queue.length) {
      const comment = queue.shift();
      if (comment.id === id) {
        event.preventDefault();
        const form = event.currentTarget;
        const response = await fetch(API_BASE + form.getAttribute("action"), {
          method: form.method,
          body: new URLSearchParams(new FormData(form)),
          credentials: "include",
        });
        const newComment = await response.json();
        comment.comments.push(newComment);
        form.closest(".accordion").querySelector("button").click();
        form.reset();
        break;
      }
      for (const subComment of comment.comments) {
        queue.push(subComment);
      }
    }

    setComments(newComments);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-3 sm:w-5/6 md:w-3/4 lg:w-2/3 xl-1/2 mx-auto">
        {/* Post title, Delete, post, and Naver/Kakao map link */}
        <div className="text-center mb-3 justify-center">
          <div className="flex justify-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral w-min self-center">
              {post.title}
            </h2>
            {/* If the post user and logged in user are the same, display a delete button */}
            {post.user === user._id && (
              <form
                action={`/api/post/deletePost/${post._id}?_method=DELETE`}
                method="POST"
                className="w-16 justify-center"
                onSubmit={handleDelete}
              >
                <button className="w-20 btn btn-ghost" type="submit">
                  <img
                    src={trash}
                    className="w-7"
                    alt="Trash delete post icon. Ui icons created by Good Ware - Flaticon"
                  ></img>
                </button>
              </form>
            )}
          </div>
          <a
            className="text-sm md:text-base text-neutral underline"
            href={post.naverLink}
            target="/blank"
          >
            Find me on Naver or Kakao :)
          </a>
        </div>
        {/* Image Carousel with post images */}
        <div className="sm:w-5/6 md:w-3/4 lg:w-2/3 xl-1/2">
          <ImageCarousel
            key={post._id}
            images={post.image}
            caption={post.caption}
            className=""
          />
        </div>
        {/* Like and Save post buttons */}
        <div className="row justify-evenly mt-1">
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
        {/* Number of likes */}
        <h3 className="">Likes: {post.likes}</h3>
        {/* Post caption */}
        <div className="col-3 mt-5">
          <p>{post.caption}</p>
        </div>
        {/* Post comments section */}
        <div className="mt-5">
          <h2>Add a comment</h2>
          <form
            action={"/api/comment/createComment/" + post._id}
            method="POST"
            onSubmit={handleAddComment}
          >
            <div className="mb-3">
              <label htmlFor="text" className="form-label">
                Comment
              </label>
              <textarea
                className="form-control"
                id="text"
                name="text"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" value="Upload">
              Submit
            </button>
          </form>
        </div>
        <ul>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              depth={0}
              postId={post._id}
              userId={user._id}
              deleteComment={deleteComment}
              updateComment={updateComment}
              addComment={addComment}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
