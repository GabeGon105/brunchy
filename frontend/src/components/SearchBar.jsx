export default function SearchBar({ searchText, setSearchText }) {
  return (
    // Form with text input search bar, onChange handler on the text input to update the rendered drink list
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="container flex flex-col items-center w-full pb-3">
        <label
          className="flex justify-center text-neutral mb-1"
          htmlFor="searchBar"
        >
          Looking for something specific?
        </label>
        <input
          type="text"
          value={searchText}
          placeholder="Croissant"
          className="input input-primary input-bordered w-full max-w-xs"
          id="searchBar"
          name="searchText"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    </form>
  );
}
