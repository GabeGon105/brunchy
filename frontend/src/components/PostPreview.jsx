import { Link } from "react-router-dom";

const PostPreview = ({ _id, image, caption }) => (
  <li className="justify-content-between mb-4 shadow-xl hover:opacity-70">
    <Link to={`/post/${_id}`}>
      <img
        className="w-60 rounded ring ring-primary ring-offset-base-100"
        src={image}
        alt={caption}
      />
    </Link>
  </li>
);

export default PostPreview;
