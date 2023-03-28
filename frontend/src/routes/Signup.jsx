import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { API_BASE } from "../constants";
import brunchy from "../images/brunchy-color.png";
import { toast } from "react-toastify";

export default function Signup() {
  const { user, setUser, setMessages } = useOutletContext();
  const [userNameInput, setUserNameInput] = useState("");
  const navigate = useNavigate();

  if (user) {
    navigate(`/profile/${user._id}`);
    window.location.reload();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      body: new URLSearchParams(new FormData(form)),
      credentials: "include",
    });
    const json = await response.json();
    if (json.messages.errors) {
      // setMessages(json.messages);
      // React toastify errors messages
      json.messages.errors.map((el) => toast.error(el.msg));
    }
    if (json.messages.success) {
      // setMessages(json.messages);
      // React toastify success message
      json.messages.success.map((el) => toast.success(el.msg));
    }
    if (json.user) {
      setUser(json.user);
      navigate(`/profile/${json.user._id}`);
    }
  };

  const handleUserNameInputChange = (e) => {
    const onlyLetters = e.target.value.replace(/[^a-z]/gi, "");
    setUserNameInput(onlyLetters);
  };

  return (
    <main className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="flex flex-col text-center lg:text-left">
          <img
            src={brunchy}
            className="w-40 self-center"
            alt="Brunchy person and toast holding hands icon. Brunch icons created by paulalee - Flaticon"
          ></img>
          <h1 className="text-5xl font-bold text-neutral">
            <Link to="/">Brunchy</Link>
          </h1>
          <p className="py-6 text-neutral">
            Explore your city through brunches, breakfasts, and bakeries with
            Brunchy!
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 ml-10">
          <div className="card-body">
            <form
              action="/signup"
              method="POST"
              onSubmit={handleSubmit}
              className=""
            >
              {/* Username input */}
              <div className="form-control border-0 bg-base-100">
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  required
                  value={userNameInput}
                  maxLength="30"
                  placeholder="Username"
                  className="input input-bordered drop-shadow-md text-neutral"
                  onChange={handleUserNameInputChange}
                />
              </div>
              <div className="form-control border-0 bg-base-100">
                {/* Email input */}
                <input
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  name="email"
                  type="email"
                  required
                  maxLength="350"
                  placeholder="Email"
                  className="input input-bordered drop-shadow-md text-neutral"
                />
                <span id="emailHelp" className="form-text text-neutral">
                  * We'll never share your email with anyone.
                </span>
              </div>
              <div className="form-control border-0 bg-base-100">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  maxLength="30"
                  placeholder="Password"
                  className="input input-bordered drop-shadow-md text-neutral"
                />
              </div>
              <div className="form-control border-0 bg-base-100">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  maxLength="30"
                  placeholder="Confirm Password"
                  className="input input-bordered drop-shadow-md text-neutral"
                />
              </div>
              <div className="form-control mt-6 border-0 bg-base-100">
                <button className="btn btn-primary shadow-md">Sign Up</button>
              </div>
            </form>
            <div className="divider text-neutral">or</div>
            <div className="form-control border-0 bg-base-100">
              <Link to="/" className="btn btn-secondary shadow-md">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
