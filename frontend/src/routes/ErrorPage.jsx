import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div
      className="bg-base-200 pb-20 min-h-screen flex flex-col items-center"
      id="error-page"
    >
      <h1 className="text-neutral text-center text-xl mt-8">
        Whoa there, fella...
      </h1>
      <p className="text-neutral text-center">Head back to Brunchy, quick!</p>
      <Link to="/" className="btn btn-primary shadow-md w-52 mt-4">
        Brunchy
      </Link>
      <span className="mt-4">ʕ•́ᴥ•̀ʔ</span>
      <p>
        <i>{`Error: ${error.statusText || error.message}`}</i>
      </p>
    </div>
  );
}
