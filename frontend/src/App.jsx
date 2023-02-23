function App() {
  return (
    <main className="container">
      <div className="row justify-content-around mt-5">
        <a href="/login" className="col-3 btn btn-primary">
          {" "}
          Login
        </a>
        <a href="/signup" className="col-3 btn btn-primary">
          {" "}
          Signup
        </a>
      </div>
    </main>
  );
}

export default App;
