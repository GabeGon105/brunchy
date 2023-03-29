import PostPreview from "./PostPreview";
import Masonry from "@mui/lab/Masonry";

const PostList = ({ posts }) => (
  <Masonry
    columns={{ xs: 2, md: 3, lg: 4, xl: 5, xxl: 6 }}
    spacing={0.5}
    className="list-unstyled"
  >
    {posts.map((post) => (
      <PostPreview key={post._id} {...post} />
    ))}
  </Masonry>
);

export default PostList;
