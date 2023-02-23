import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import PostList from "../components/PostList";
import { API_BASE } from "../constants";
import "../style.css";
import { ToastContainer, toast } from "react-toastify";
import create from "../images/create-color.png";

export function Profile() {
  const { user, setMessages } = useOutletContext();
  const [image, setImage] = useState({ preview: "", data: "" });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(API_BASE + "/api/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  if (!user) return null;

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await toast.promise(
      // Async request to create a new post document
      fetch(API_BASE + form.getAttribute("action"), {
        method: form.method,
        body: new FormData(form),
        credentials: "include",
      }),
      // React toast promise
      {
        pending: "Your post is being created 🤓",
        success: "Your post has been added!",
        error: "Uh-oh. We couldn't create your post 🤯",
      }
    );
    const json = await response.json();
    if (json.messages) {
      // setMessages(json.messages);
      // json.messages.success.map((el) => toast.success(el.msg));
    }
    if (json.post) {
      setPosts([...posts, json.post]);
      form.reset();
      setImage("");
    }
  };

  return (
    <div className="container flex row mx-auto bg-base-200">
      {/* Container holding profile picture section and profile stats section */}
      <div className="flex flex-column mt-8 w-full md:w-5/6 mx-auto">
        {/* Container holding profile picture */}
        <div className="flex mx-auto">
          <div className="avatar self-center">
            <div className="w-28 rounded-full  shadow-xl ring ring-primary ring-offset-1">
              <img src={user.image} alt="user profile photo" />
            </div>
          </div>
        </div>

        {/* Username display */}
        <h2 className="mt-2 text-2xl font-semibold text-neutral text-center">
          {user.userName}
        </h2>

        {/* user bio description */}
        <div className="flex mx-auto">
          <p className="mt-2 text-m text-center">{user.bio}</p>
        </div>
        {/* Container holding number of followers and following */}
        <div className="flex mt-2 w-1/2 self-center">
          <div className="w-1/2">
            <p className="text-m text-neutral text-center">
              <span className="font-semibold">{user.followers.length}</span>
              <br />
              followers
            </p>
          </div>
          <div className="w-1/2">
            <p className="text-m text-neutral text-center">
              <span className="font-semibold">{user.following.length}</span>
              <br />
              following
            </p>
          </div>
        </div>
      </div>

      {/* Create new post upload form section */}
      <div className="flex justify-center mt-2 row mx-auto self-center">
        {/* Collapsable form */}
        <button
          className="self-center w-20 h-20 btn btn-ghost"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#postFormCollapse"
          aria-expanded="false"
          aria-controls="postFormCollapse"
        >
          <img
            src={create}
            className="w-10 self-center"
            alt="Create add icon. Add icons created by srip - Flaticon"
          ></img>
          <span className="self-center text-neutral">Create</span>
        </button>
        <div className="collapse" id="postFormCollapse">
          <div className="p-6 rounded-lg bg-base-100 my-3">
            {/* New post upload form */}
            <form
              action="/api/post/createPost"
              encType="multipart/form-data"
              method="POST"
              onSubmit={handleSubmit}
            >
              {/* Flex container for form inputs div and image upload preview div */}
              <div className="md:flex mb-3">
                {/* Location name input */}
                <div className="md:w-1/2 mr-3 mb-8">
                  <div className="mb-3">
                    <input
                      type="text"
                      required
                      placeholder="Location name"
                      className="input input-bordered input-primary w-full"
                      id="title"
                      name="title"
                    />
                  </div>
                  {/* Naver Maps link input */}
                  <div className="mb-3">
                    <input
                      type="text"
                      required
                      placeholder="Naver / Kakao Maps link"
                      className="input input-bordered input-primary w-full"
                      id="naverLink"
                      name="naverLink"
                    />
                  </div>
                  {/* Location description input */}
                  <div className="mb-3">
                    <textarea
                      required
                      className="textarea textarea-primary w-full"
                      placeholder="Description"
                      id="caption"
                      name="caption"
                    ></textarea>
                  </div>
                  {/* Image upload */}
                  <div className="mb-3">
                    <input
                      type="file"
                      multiple
                      required
                      className="file-input file-input-bordered file-input-primary w-full"
                      id="imageUpload"
                      name="file"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                {/* Image upload preview  */}
                <div className="my-3 md:w-1/2 ml-3">
                  {image.preview && (
                    <div className="indicator w-full">
                      <span className="indicator-item indicator-top indicator-center badge badge-secondary">
                        Upload Preview
                      </span>
                      <div className="grid w-full place-items-center">
                        <img
                          src={image.preview}
                          className="w-80 ring ring-secondary"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-32"
                value="Upload"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* If the user has no posts, return an h3 saying to make a post, else show PostList */}
      {posts.length === 0 ? (
        <h3 className="text-center text-neutral">
          pssst... it looks kinda empty here... maybe..
          <br /> ..maybe post your favorite spot? :)
        </h3>
      ) : (
        <PostList
          posts={posts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )}
        />
      )}

      {/* <div className="row mt-5">
        <div className="col-6">
          <div>
            <Link to="/logout" className="col-3 btn btn-primary">
              Logout
            </Link>
          </div>
          <div className="mt-5">
          </div>
        </div>

        <div className="col-6">
          <PostList posts={posts} />
          <div className="row justify-content-center mt-5">
            <Link className="btn btn-primary" to="/feed">
              Return to Feed
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
}
