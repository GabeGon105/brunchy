import PostPreview from "./PostPreview";

const PostList = ({ posts }) => (
  <ul className="list-unstyled justify-center columns-2 md:columns-3 lg:columns-4 xl:column-5">
    {posts.map((post) => (
      <PostPreview key={post._id} {...post} />
    ))}
  </ul>
);

export default PostList;
