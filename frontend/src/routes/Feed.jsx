import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { toast } from "react-toastify";
import PostList from "../components/PostList";
import SwapIcon from "../components/SwapIcon";
import { API_BASE } from "../constants";

export default function Feed() {
  const { user } = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [followingFilter, setFollowingFilter] = useState(false);
  const [brunchFilter, setBrunchFilter] = useState(true);
  const [breakfastFilter, setBreakfastFilter] = useState(true);
  const [bakeryFilter, setBakeryFilter] = useState(true);

  useEffect(() => {
    toast.promise(
      fetch(API_BASE + "/api/feed", { credentials: "include" })
        .then((res) => res.json())
        .then(async ({ posts }) => {
          setPosts(posts);
          setFilteredPosts(posts);
        }),
      // React toast promise
      {
        pending: "Loading feed...",
        error: "Uh-oh. We couldn't load feed 🤯",
      }
    );
  }, []);

  const handleFollowingFilter = () => {
    // change followingFilter to the opposite of it's previous state
    setFollowingFilter(!followingFilter);
  };
  useEffect(() => {
    handlePostsFilter();
  }, [followingFilter]);

  const handleBrunchFilter = () => {
    // change brunchFilter to the opposite of it's previous state
    setBrunchFilter(!brunchFilter);
  };

  const handleBreakfastFilter = () => {
    // change breakfastFilter to the opposite of it's previous state
    setBreakfastFilter(!breakfastFilter);
  };

  const handleBakeryFilter = () => {
    // change bakeryFilter to the opposite of it's previous state
    setBakeryFilter(!bakeryFilter);
  };
  useEffect(() => {
    handlePostsFilter();
  }, [brunchFilter, breakfastFilter, bakeryFilter]);

  const handlePostsFilter = () => {
    let newFilteredPostsArray = [];

    // if brunchFilter is true, loop through posts and if the post includes type "Brunch" and if newFilteredPostsArray does not include the post, then push to newFilteredPostsArray
    if (brunchFilter) {
      posts.forEach((post) =>
        post.type.includes("Brunch") && !newFilteredPostsArray.includes(post)
          ? newFilteredPostsArray.push(post)
          : null
      );
    }
    // if breakfastFilter is true, loop through posts and if the post includes type "Breakfast" and if newFilteredPostsArray does not include the post, then push to newFilteredPostsArray
    if (breakfastFilter) {
      posts.forEach((post) =>
        post.type.includes("Breakfast") && !newFilteredPostsArray.includes(post)
          ? newFilteredPostsArray.push(post)
          : null
      );
    }
    // if bakeryFilter is true, loop through posts and if the post includes type "Bakery" and if newFilteredPostsArray does not include the post, then push to newFilteredPostsArray
    if (bakeryFilter) {
      posts.forEach((post) =>
        post.type.includes("Bakery") && !newFilteredPostsArray.includes(post)
          ? newFilteredPostsArray.push(post)
          : null
      );
    }
    // if followingFilter is true, filter through newFilteredPostsArray and return each post only if user.following includes post.user, then reassign newFilteredPostsArray
    if (followingFilter) {
      newFilteredPostsArray = newFilteredPostsArray.filter((post) =>
        user.following.includes(post.user)
      );
    }

    setFilteredPosts(newFilteredPostsArray);
  };

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

  const swapOnBadges = [
    <div className="swap-on badge badge-lg">Following Only</div>,
    <div className="swap-on badge badge-lg badge-primary text-neutral">
      Brunch
    </div>,
    <div className="swap-on badge badge-lg badge-secondary text-neutral">
      Breakfast
    </div>,
    <div className="swap-on badge badge-lg badge-accent text-neutral">
      Bakery
    </div>,
  ];

  const swapOffBadges = [
    <div className="swap-off badge badge-lg badge-outline">Following Only</div>,
    <div className="swap-off badge badge-lg badge-primary badge-outline text-neutral">
      Brunch
    </div>,
    <div className="swap-off badge badge-lg badge-secondary badge-outline text-neutral">
      Breakfast
    </div>,
    <div className="swap-off badge badge-lg badge-accent badge-outline text-neutral">
      Bakery
    </div>,
  ];

  return (
    <div className="container">
      <div className="row justify-content-center mt-4">
        <h2 className="text-center text-neutral font-semibold text-xl mb-3">
          Explore
        </h2>
        <div className="flex w-full justify-center mb-4">
          <SwapIcon
            className=""
            key="following-filter"
            filter={followingFilter}
            swapOn={swapOnBadges[0]}
            swapOff={swapOffBadges[0]}
            click={handleFollowingFilter}
          />
        </div>
        <div className="flex w-full sm:w-2/3 md:w-1/2 lg:w1-/3 justify-evenly mb-4">
          <SwapIcon
            className="w-1/3"
            key="brunch-filter"
            filter={brunchFilter}
            swapOn={swapOnBadges[1]}
            swapOff={swapOffBadges[1]}
            click={handleBrunchFilter}
          />
          <SwapIcon
            className="w-1/3"
            key="breakfast-filter"
            filter={breakfastFilter}
            swapOn={swapOnBadges[2]}
            swapOff={swapOffBadges[2]}
            click={handleBreakfastFilter}
          />
          <SwapIcon
            className="w-1/3"
            key="bakery-filter"
            filter={bakeryFilter}
            swapOn={swapOnBadges[3]}
            swapOff={swapOffBadges[3]}
            click={handleBakeryFilter}
          />
        </div>
        {posts.length !== 0 && filteredPosts.length === 0 && (
          <p className="text-neutral text-center mt-5">
            ʕ•ᴥ•ʔ <br />
            No posts to show
          </p>
        )}
        <PostList
          posts={filteredPosts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )}
        />
      </div>
    </div>
  );
}
