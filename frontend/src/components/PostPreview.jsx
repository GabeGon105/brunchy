import { Link } from "react-router-dom";

const PostPreview = ({ _id, image, caption }) => (
  <li className={`justify-content-between shadow-xl hover:opacity-70 `}>
    <Link to={`/post/${_id}`}>
      <img className="w-min-60" src={image[0]} alt={caption} />
    </Link>
  </li>
);

export default PostPreview;
