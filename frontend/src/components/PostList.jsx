import PostPreview from "./PostPreview";
import { Masonry } from "@mui/lab";

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

// const PostList = ({ posts }) => (
//   <ul className="list-unstyled justify-center columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-1">
//     {posts.map((post) => (
//       <PostPreview key={post._id} {...post} />
//     ))}
//   </ul>
// );

export default PostList;
