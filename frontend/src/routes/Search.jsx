import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import UsersList from "../components/UsersList";
import PostList from "../components/PostList";
import SwapIcon from "../components/SwapIcon";
import { API_BASE } from "../constants";

export default function Search() {
  const { user } = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [searchPostsActive, setSearchPostsActive] = useState(true);
  const [searchUsersActive, setSearchUsersActive] = useState(false);
  const [usersArr, setUsersArr] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [brunchFilter, setBrunchFilter] = useState(true);
  const [breakfastFilter, setBreakfastFilter] = useState(true);
  const [bakeryFilter, setBakeryFilter] = useState(true);

  // If searchText is not empty, fetch the data for the text input
  useEffect(() => {
    // Posts search
    if (searchPostsActive === true && searchText !== "") {
      const timeoutId = setTimeout(() => {
        fetch(API_BASE + `/api/searchPosts/${searchText}`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then(({ posts }) => {
            setPosts(posts);
            setFilteredPosts(posts);
          });
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    // Users search
    if (searchUsersActive === true && searchText !== "") {
      const timeoutId = setTimeout(() => {
        fetch(API_BASE + `/api/searchUsers/${searchText}`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then(({ users }) => {
            setUsersArr(users);
          });
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [searchText]);

  const handleSearchPostsClick = () => {
    if (searchPostsActive === false) {
      setSearchText("");
      setPosts([]);
      setBrunchFilter(true);
      setBreakfastFilter(true);
      setBakeryFilter(true);
      setFilteredPosts([]);
      setSearchPostsActive(true);
      setSearchUsersActive(false);
    }
  };

  const handleSearchUsersClick = () => {
    if (searchUsersActive === false) {
      setSearchText("");
      setUsersArr([]);
      setSearchUsersActive(true);
      setSearchPostsActive(false);
    }
  };

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
  }, [brunchFilter, breakfastFilter, bakeryFilter, posts]);

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
        <div className="tabs tabs-boxed flex w-full sm:w-2/3 md:w-1/2 lg:w1-/3 justify-evenly">
          <h2
            className={`tab ${
              searchPostsActive ? "tab-active" : ""
            } text-center text-neutral font-semibold text-xl mb-3`}
            onClick={handleSearchPostsClick}
          >
            Search Posts
          </h2>
          <h2
            className={`tab ${
              searchUsersActive ? "tab-active" : ""
            } text-center text-neutral font-semibold text-xl mb-3`}
            onClick={handleSearchUsersClick}
          >
            Search Users
          </h2>
        </div>
        {searchPostsActive && (
          <>
            <SearchBar
              searchType={searchPostsActive ? "posts" : "users"}
              searchText={searchText}
              setSearchText={setSearchText}
            />
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
              <p className="text-neutral text-center mt-4">
                ? <br />
                ʕ•ᴥ•ʔ
              </p>
            )}
            <PostList
              posts={filteredPosts.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              )}
            />
          </>
        )}
        {searchUsersActive && (
          <>
            <SearchBar
              searchType={searchPostsActive ? "posts" : "users"}
              searchText={searchText}
              setSearchText={setSearchText}
            />
            {usersArr.length === 0 && (
              <p className="text-neutral text-center mt-4">
                ? <br />
                ʕ•ᴥ•ʔ
              </p>
            )}
            <UsersList usersArr={usersArr} />
          </>
        )}
      </div>
    </div>
  );
}
