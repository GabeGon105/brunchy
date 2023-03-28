import { Link } from "react-router-dom";

const UsersList = ({ usersArr, handleClick }) => (
  <ul
    className="flex flex-col items-center"
    role="group"
    aria-label="User List"
  >
    {usersArr.map((user, i) => {
      return (
        <li
          key={user[0]}
          className={`flex flex-col items-center w-full py-2 ${
            i % 2 === 0 ? "" : "bg-base-200"
          }`}
        >
          <div className="flex items-center space-x-3 w-80">
            <div className="avatar">
              <div className="w-12 rounded-full hover:opacity-50">
                <Link to={`/profile/${user[0]}`} onClick={handleClick}>
                  <img src={user[2]} alt={`User photo of ${user[1]}`} />
                </Link>
              </div>
            </div>
            <div>
              <Link to={`/profile/${user[0]}`} onClick={handleClick}>
                <span className="text-neutral font-bold hover:text-cyan-500">
                  {user[1]}
                </span>
              </Link>
              <div className="text-sm opacity-50">
                {user[3].slice(0, 30)}
                {user[3].length > 30 ? "..." : ""}
              </div>
            </div>
          </div>
        </li>
      );
    })}
  </ul>
);

export default UsersList;
