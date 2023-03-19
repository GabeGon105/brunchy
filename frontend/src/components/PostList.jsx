import PostPreview from "./PostPreview";

const PostList = ({ posts }) => (
  <ul className="list-unstyled justify-center columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-1">
    {posts.map((post) => (
      <PostPreview key={post._id} {...post} />
    ))}
  </ul>
);

export default PostList;
