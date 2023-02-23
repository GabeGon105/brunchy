// this page is not used
// this page is not used
// this page is not used
// this page is not used
// this page is not used
// this page is not used

import { useNavigate, useOutletContext } from "react-router-dom";
import { API_BASE } from "../constants";

export default function Login() {
  const { setUser, setMessages } = useOutletContext();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(API_BASE + form.getAttribute("action"), {
      method: form.method,
      body: new URLSearchParams(new FormData(form)),
      credentials: "include",
    });
    const json = await response.json();
    if (json.messages) setMessages(json.messages);
    if (json.user) {
      setUser(json.user);
      navigate("/profile");
    }
  };

  return (
    <main className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Brunchy</h1>
          <p className="py-6">
            Explore your city through breakfasts, cafes, and brunches with
            Brunchy!
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form
            action="/login"
            method="POST"
            onSubmit={handleSubmit}
            className="card-body"
          >
            <div className="form-control border-0 ">
              <label className="label" htmlFor="exampleInputEmail1">
                <span className="label-text">Email</span>
              </label>
              <input
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                name="email"
                type="email"
                placeholder="email"
                className="input input-bordered drop-shadow-md"
              />
            </div>
            <div className="form-control border-0">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                className="input input-bordered drop-shadow-md"
              />
            </div>
            <div className="form-control mt-6 border-0">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
