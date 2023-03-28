import { useEffect, useState, useRef } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import PostList from "../components/PostList";
import UsersList from "../components/UsersList";
import ImageCarousel from "../components/ImageCarousel";
import { API_BASE } from "../constants";
import "../style.css";
import { toast } from "react-toastify";
import create from "../images/create-color.png";
import edit from "../images/edit-color.png";
import brunchy from "../images/brunchy-color.png";
import brunchyNoColor from "../images/brunchy.png";

export default function Profile() {
  const { user, setUser } = useOutletContext();
  const [profileUser, setProfileUser] = useState();
  const profileId = useParams().id;
  const [images, setImages] = useState({ files: [] });
  const [uploadImages, setUploadImages] = useState({ files: [] });
  const [imageEdit, setImageEdit] = useState({ preview: "", data: "" });
  const [posts, setPosts] = useState([]);
  const [followersUsersArr, setFollowersUsersArr] = useState([]);
  const [followingUsersArr, setFollowingUsersArr] = useState([]);
  const [checkedState, setCheckedState] = useState(new Array(3).fill(false));
  const [followButtonDisabled, setfollowButtonDisabled] = useState(false);
  const [mapsLinkText, setMapsLinkText] = useState("");

  const followButtonClick = () => {
    setfollowButtonDisabled(true);
    setTimeout(() => {
      setfollowButtonDisabled(false);
    }, 1000);
  };

  const handlePostTypeChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  const createPostRef = useRef(null);
  const closeCreatePostForm = () => {
    createPostRef.current.click();
  };
  const followersRef = useRef(null);
  const closeFollowers = () => {
    followersRef.current.click();
  };
  const followingRef = useRef(null);
  const closeFollowing = () => {
    followingRef.current.click();
  };
  // call a click event to close the Edit Profile modal when the Sumbit Edit Profile button is clicked
  const editProfileRef = useRef(null);
  const handleClickProfile = () => {
    editProfileRef.current.click();
  };

  const fileInputRef = useRef();

  useEffect(() => {
    fetch(API_BASE + `/api/profile/${profileId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(({ posts, profileUser, followersUsersArr, followingUsersArr }) => {
        setProfileUser(profileUser);
        setPosts(posts);
        setImageEdit({
          ...imageEdit,
          preview: profileUser.image,
        });
        setFollowersUsersArr(followersUsersArr);
        setFollowingUsersArr(followingUsersArr);
      });
  }, [setProfileUser, profileId]);

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

  if (profileUser === undefined) return null;
  else if (profileUser === null) return <h2>Profile not found</h2>;

  const handleFileChange = (e) => {
    if (e.target.files.length > 0 && uploadImages.files.length < 5) {
      const image = {
        preview: URL.createObjectURL(e.target.files[0]),
        data: Object.values(e.target.files[0]),
      };
      setImages({ files: [...images.files, image] });
      setUploadImages({ files: [...uploadImages.files, e.target.files[0]] });
    } else if (e.target.files.length > 0 && uploadImages.files.length === 5) {
      toast.warning(
        "Only a maximum of 5 photos may be uploaded in a single post."
      );
    } else {
      setImages({ files: [] });
      setUploadImages({ files: [] });
    }
  };

  const handleFileChangeEdit = (e) => {
    if (e.target.files.length > 0) {
      const img = {
        preview: URL.createObjectURL(e.target.files[0]),
        data: e.target.files[0],
      };
      setImageEdit(img);
    } else {
      setImageEdit({ ...imageEdit, preview: profileUser.image });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    fileInputRef.current.value = null;
    const form = event.currentTarget;
    const formData = new FormData(event.currentTarget);
    uploadImages.files.forEach((file) => {
      formData.append("file", file);
    });
    const response = await toast.promise(
      // Async request to create a new post document
      fetch(API_BASE + form.getAttribute("action"), {
        method: form.method,
        body: formData,
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

    if (json.post) {
      setPosts([...posts, json.post]);
      form.reset();
      setMapsLinkText("");
      setCheckedState(new Array(3).fill(false));
      setImages({ files: [] });
      setUploadImages({ files: [] });
      closeCreatePostForm();
    }
  };

  const handleFollow = async (event) => {
    followButtonClick();
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      credentials: "include",
    });
    const json = await response.json();
    // If there is a success message after following the user, send a toastify success alert
    if (json.messages) {
      json.messages.success.map((el) => toast.success(el.msg));
    }

    // Spread out the previous profileUser state, update the followers, then setProfileUser
    setProfileUser({
      ...profileUser,
      followers: json.updatedProfileUser.followers,
    });
    // Spread out the previous user state, update the following, then setUser
    setUser({
      ...user,
      following: json.updatedUser.following,
    });
    if (json.unfollowed) {
      setFollowersUsersArr(
        followersUsersArr.filter((follower) => follower[0] !== user._id)
      );
    }
    if (json.followed) {
      setFollowersUsersArr(
        followersUsersArr.concat([
          [user._id, user.userName, user.image, user.bio.slice(0, 30)],
        ])
      );
    }
  };

  const handleEditUser = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    const response = await toast.promise(
      // Async request to edit the current user's info
      fetch(API_BASE + form.getAttribute("action"), {
        method: form.method,
        body: new FormData(form),
        credentials: "include",
      }),
      // React toast promise
      {
        pending: "Your profile is being edited 🤓",
        success: "Your profile has been edited!",
        error: "Uh-oh. We couldn't edit your profile 🤯",
      }
    );

    const json = await response.json();

    // Spread out the previous user state, update the bio, cloudinaryId, and image, then setUser
    setUser({
      ...user,
      bio: json.updatedUser.bio,
      cloudinaryId: json.updatedUser.cloudinaryId,
      image: json.updatedUser.image,
    });
    setProfileUser({
      ...profileUser,
      bio: json.updatedUser.bio,
      cloudinaryId: json.updatedUser.cloudinaryId,
      image: json.updatedUser.image,
    });
    form.reset();
  };

  const handleMapsLinkTextChange = (e) => {
    const mapsLinkTextArr = e.target.value.split(" ");
    setMapsLinkText(mapsLinkTextArr[mapsLinkTextArr.length - 1]);
  };

  return (
    <div className="container">
      {/* Container holding profile picture section and profile stats section */}
      <div className="flex flex-column mt-2 w-full md:w-5/6 mx-auto">
        <div className="flex mx-auto">
          <div className="w-20"></div>
          {/* Container holding profile picture */}
          <div className="avatar self-center mt-4">
            <div className="w-28 rounded-full  shadow-xl ring ring-primary ring-offset-1">
              <img
                src={profileUser ? profileUser.image : null}
                alt="user profile photo"
              />
            </div>
          </div>
          {/* If profileId matches the user.id, allow the user to edit their profile */}
          <div className="w-20">
            {profileId === user._id && (
              <>
                {/* The button to open modal */}
                <label
                  htmlFor={`modal-${user.id}`}
                  className="ml-2 w-10 btn btn-ghost text-lg p-0 m-0"
                >
                  <img
                    src={edit}
                    className="w-6 md:w-7"
                    alt="Edit icons created by Freepik - Flaticon"
                  ></img>
                </label>

                <input
                  type="checkbox"
                  id={`modal-${user.id}`}
                  className="modal-toggle"
                />
                <label
                  htmlFor={`modal-${user.id}`}
                  className="modal modal-bottom sm:modal-middle cursor-pointer"
                  ref={editProfileRef}
                >
                  <label className="modal-box relative" htmlFor="">
                    <div
                      className="flex flex-col items-center"
                      role="group"
                      aria-label="Profile Actions"
                    >
                      <div className="flex flex-col items-center mt-4 w-full">
                        <div className="mt-2 w-full rounded-lg bg-base-100 my-3 flex flex-col items-center">
                          {/* Edit user update form */}
                          <form
                            action={`/api/editUser?_method=PUT`}
                            method="POST"
                            encType="multipart/form-data"
                            className="flex flex-col items-center mt-2 w-full"
                            onSubmit={handleEditUser}
                          >
                            <h3 className="text-neutral font-semibold mb-4">
                              Edit Profile
                            </h3>
                            {/* Profile photo file upload */}
                            <div className="w-3/4 md:flex md:flex-col mb-3">
                              <label
                                className="label text-neutral"
                                htmlFor="bio"
                              >
                                Profile photo:
                              </label>
                              {/* Image upload preview  */}
                              {imageEdit.preview && (
                                <div className="flex justify-center indicator w-full mb-4">
                                  <span className="indicator-item indicator-bottom indicator-center badge badge-secondary">
                                    Upload Preview
                                  </span>
                                  <div className="avatar self-center">
                                    <div className="w-28 rounded-full shadow-xl ring ring-primary ring-offset-1">
                                      <img
                                        src={imageEdit.preview}
                                        alt="user profile photo"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              <input
                                type="file"
                                className="file-input file-input-bordered file-input-primary w-full"
                                id="file"
                                name="file"
                                onChange={handleFileChangeEdit}
                              />
                            </div>
                            {/* Profile bio edit */}
                            <div className="w-3/4 md:flex md:flex-col mb-3">
                              <label
                                className="label text-neutral"
                                htmlFor="bio"
                              >
                                Profile bio:
                              </label>
                              <textarea
                                maxLength="150"
                                rows="4"
                                className="textarea textarea-primary w-full"
                                defaultValue={user.bio}
                                id="bio"
                                name="bio"
                              ></textarea>
                            </div>
                            <button
                              type="submit"
                              className="btn btn-primary w-52"
                              value="Upload"
                              onClick={handleClickProfile}
                            >
                              Submit edit
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="modal-action flex justify-center mt-3">
                      <label
                        htmlFor={`modal-${user.id}`}
                        className="underline  text-neutral cursor-pointer"
                      >
                        Cancel
                      </label>
                    </div>
                  </label>
                </label>
              </>
            )}
          </div>
        </div>

        {/* Username display */}
        <h2 className="mt-2 text-2xl font-semibold text-neutral break-words text-center">
          {profileUser ? profileUser.userName : null}
        </h2>

        {/* user bio description */}
        <div className="flex mx-auto">
          <p className="mt-2 text-m text-center text-neutral break-words">
            {profileUser ? profileUser.bio : null}
          </p>
        </div>
        {/* Container holding number of followers and following */}
        <div className="flex mt-2 w-1/2 self-center">
          <div className="flex justify-center w-1/2">
            {/* The button to open following users modal */}
            <label
              htmlFor={`modal-${user._id}-followers`}
              className="text-m text-neutral text-center hover:text-cyan-500 cursor-pointer"
            >
              <span className="font-semibold">
                {profileUser ? profileUser.followers.length : null}
              </span>
              <br />
              followers
            </label>

            <input
              type="checkbox"
              id={`modal-${user._id}-followers`}
              className="modal-toggle"
            />
            <label
              htmlFor={`modal-${user._id}-followers`}
              className="modal modal-bottom sm:modal-middle cursor-pointer"
            >
              <label className="modal-box relative" htmlFor="">
                <div>
                  <h3 className="text-neutral font-semibold text-center mb-2">
                    {`Followers: ${followersUsersArr.length}`}
                  </h3>
                  <UsersList
                    usersArr={followersUsersArr}
                    handleClick={closeFollowers}
                  />
                  <div className="modal-action flex justify-center mt-3">
                    <label
                      htmlFor={`modal-${user._id}-followers`}
                      className="underline  text-neutral cursor-pointer"
                      ref={followersRef}
                    >
                      Close
                    </label>
                  </div>
                </div>
              </label>
            </label>
          </div>
          <div className="flex justify-center w-1/2">
            {/* The button to open following users modal */}
            <label
              htmlFor={`modal-${user._id}-following`}
              className="text-m text-neutral text-center hover:text-cyan-500 cursor-pointer"
            >
              <span className="font-semibold">
                {profileUser ? profileUser.following.length : null}
              </span>
              <br />
              following
            </label>

            <input
              type="checkbox"
              id={`modal-${user._id}-following`}
              className="modal-toggle"
            />
            <label
              htmlFor={`modal-${user._id}-following`}
              className="modal modal-bottom sm:modal-middle cursor-pointer"
            >
              <label className="modal-box relative" htmlFor="">
                <div>
                  <h3 className="text-neutral font-semibold text-center mb-2">
                    {`Following: ${followingUsersArr.length}`}
                  </h3>
                  <UsersList
                    usersArr={followingUsersArr}
                    handleClick={closeFollowing}
                  />
                  <div className="modal-action flex justify-center mt-3">
                    <label
                      htmlFor={`modal-${user._id}-following`}
                      className="underline  text-neutral cursor-pointer"
                      ref={followingRef}
                    >
                      Close
                    </label>
                  </div>
                </div>
              </label>
            </label>
          </div>
        </div>
      </div>

      {/* If the profileId matches the user.id, allow the user to create a post */}
      {profileId === user._id && (
        <>
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
              ref={createPostRef}
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
                          maxLength="50"
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
                          value={mapsLinkText}
                          placeholder="Naver / Kakao Maps link"
                          className="input input-bordered input-primary w-full"
                          id="naverLink"
                          name="naverLink"
                          onChange={handleMapsLinkTextChange}
                        />
                      </div>
                      {/* Breakfast, Brunch, Bakery type edit */}
                      <div className="w-3/4 mb-3">
                        <h3 className="text-neutral">
                          What type of place is this?
                        </h3>
                        <span className="text-sm">(Choose at least 1)</span>
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
                              onChange={() => handlePostTypeChange(0)}
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
                              onChange={() => handlePostTypeChange(1)}
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
                              onChange={() => handlePostTypeChange(2)}
                            />
                          </label>
                        </div>
                      </div>
                      {/* Location description input */}
                      <div className="mb-3">
                        <textarea
                          required
                          maxLength="2000"
                          className="textarea textarea-primary w-full"
                          placeholder="Description"
                          id="caption"
                          name="caption"
                        ></textarea>
                      </div>
                      {/* Image upload */}
                      <div className="mb-3">
                        <label className="label text-neutral text-sm">
                          Upload photos one at a time, in the order you would
                          like to display them. Max 5.
                        </label>
                        <input
                          type="file"
                          required
                          className="file-input file-input-bordered file-input-primary w-full"
                          id="imageUpload"
                          name="file"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />

                        <button
                          className="btn btn-secondary btn text-neutral mt-3"
                          onClick={(e) => {
                            e.preventDefault();
                            e.target.value = "";
                            setImages({ files: [] });
                            setUploadImages({ files: [] });
                            toast("Upload files have been reset");
                          }}
                        >
                          Reset upload
                        </button>
                      </div>
                    </div>
                    {/* Image upload preview  */}
                    <div className="my-3 md:w-1/2 ml-3">
                      {images.files.length > 0 && (
                        <div className="indicator w-full">
                          <span className="indicator-item indicator-top indicator-center badge badge-secondary z-10">
                            Upload Preview
                          </span>
                          <div className="grid w-full place-items-center">
                            {/* Image Carousel with post image previews */}
                            <ImageCarousel
                              key={`${user._id}-post-preview`}
                              images={images.files.map(
                                (image) => image.preview
                              )}
                              className=""
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
                    disabled={!checkedState.some((state) => state)}
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* If the profileId does not match the user.id, allow the user to follow/unfollow the profile user */}
      {profileId !== user._id && (
        <>
          {/* Follow user form section */}
          <form
            className="flex justify-center mt-2 row mx-auto self-center"
            action={`/api/followUser/${profileId}?_method=PUT`}
            method="POST"
            onSubmit={handleFollow}
          >
            <button
              className="self-center w-20 h-20 btn btn-ghost"
              type="submit"
              disabled={followButtonDisabled}
            >
              <img
                src={
                  user.following.includes(profileId) ? brunchy : brunchyNoColor
                }
                className="w-12 self-center"
                alt="Brunchy person and toast holding hands icon. Brunch icons created by paulalee - Flaticon"
              ></img>
              <span className="self-center text-neutral text-xs">
                {user.following.includes(profileId) ? "Unfollow" : "Follow"}
              </span>
            </button>
          </form>
        </>
      )}

      <div className="divider"></div>

      {/* If the user has no posts, return an h3 saying to make a post, else show PostList */}
      {profileUser && posts.length === 0 && (
        <h3 className="text-center text-neutral">
          pssst... it looks kinda empty here... maybe..
          <br /> ..maybe post a new Brunchy spot? :)
        </h3>
      )}
      <PostList
        posts={posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )}
      />
    </div>
  );
}
