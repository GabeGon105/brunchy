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
  const [brunchFilter, setBrunchFilter] = useState(true);
  const [breakfastFilter, setBreakfastFilter] = useState(true);
  const [bakeryFilter, setBakeryFilter] = useState(true);

  useEffect(() => {
    toast.promise(
      fetch(API_BASE + "/api/saved", { credentials: "include" })
        .then((res) => res.json())
        .then(({ savedPosts }) => {
          setPosts(savedPosts);
          setFilteredPosts(savedPosts);
        }),
      // React toast promise
      {
        pending: "Loading saved posts...",
        error: "Uh-oh. We couldn't load saved posts 🤯",
      }
    );
  }, []);

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
          Saved Posts
        </h2>
        <div className="flex w-full sm:w-2/3 md:w-1/2 lg:w1-/3 justify-evenly mb-4">
          <SwapIcon
            className="w-1/3"
            key="brunch-filter"
            filter={brunchFilter}
            swapOn={swapOnBadges[0]}
            swapOff={swapOffBadges[0]}
            click={handleBrunchFilter}
          />
          <SwapIcon
            className="w-1/3"
            key="breakfast-filter"
            filter={breakfastFilter}
            swapOn={swapOnBadges[1]}
            swapOff={swapOffBadges[1]}
            click={handleBreakfastFilter}
          />
          <SwapIcon
            className="w-1/3"
            key="bakery-filter"
            filter={bakeryFilter}
            swapOn={swapOnBadges[2]}
            swapOff={swapOffBadges[2]}
            click={handleBakeryFilter}
          />
        </div>
        {filteredPosts.length === 0 && (
          <p className="text-neutral text-center mt-5">
            ʕ•ᴥ•ʔ <br />
            No saved posts to show
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
