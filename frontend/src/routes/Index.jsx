import { Link } from "react-router-dom";
import { useNavigate, useOutletContext } from "react-router-dom";
import { API_BASE } from "../constants";
import { toast } from "react-toastify";
import brunchy from "../images/brunchy-color.png";

export default function Index() {
  const {
    user,
    setUser,
    setEveryPostId,
    setUserNotifications,
    setUnreadUserNotifications,
    setMessages,
  } = useOutletContext();
  const navigate = useNavigate();

  if (user) {
    navigate(`/profile/${user._id}`);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await toast.promise(
      fetch(API_BASE + form.getAttribute("action"), {
        method: form.method,
        body: new URLSearchParams(new FormData(form)),
        credentials: "include",
      }),
      // React toast promise
      {
        pending: "Logging in...",
        error: "Uh-oh. We couldn't log you in 🤯",
      }
    );
    const json = await response.json();
    if (json.messages.errors) {
      // React toastify errors message
      json.messages.errors.map((el) => toast.error(el.msg));
    }
    // if (json.messages.success) {
    //   // React toastify success message
    //   json.messages.success.map((el) => toast.success(el.msg));
    // }
    if (json.user) {
      setUser(json.user);
      setEveryPostId(json.everyPostId);
      if (json.notifications.length) {
        setUserNotifications(json.notifications);
        setUnreadUserNotifications(
          json.notifications.some((notification) => !notification.read)
        );
      }

      navigate(`/profile/${json.user._id}`);
      toast.success("Welcome back to Brunchy!");
    }
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

        {/* Sign In Form */}
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <form
              action="/login"
              method="POST"
              onSubmit={handleSubmit}
              className=""
            >
              <div className="form-control border-0 bg-base-100">
                <label className="label text-neutral" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  aria-describedby="emailHelp"
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="input input-bordered drop-shadow-md text-neutral"
                />
              </div>
              <div className="form-control border-0 mt-2 bg-base-100">
                <label className="label text-neutral" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="input input-bordered drop-shadow-md text-neutral"
                />
              </div>
              <div className="form-control mt-6 border-0 bg-base-100">
                <button className="btn btn-primary shadow-md">Login</button>
              </div>
            </form>
            <div className="divider text-neutral">or</div>
            <div className="form-control border-0 bg-base-100">
              <Link to="/signup" className="btn btn-secondary shadow-md">
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
