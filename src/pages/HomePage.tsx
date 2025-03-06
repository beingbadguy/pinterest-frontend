import { useNavigate } from "react-router-dom";
import usePinterestStore from "../store/store";

const HomePage = () => {
  const { allPosts } = usePinterestStore();
  const navigate = useNavigate();
  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 mb-40 md:mb-20">
      {allPosts.map((post) => (
        <div
          key={post._id}
          className="break-inside-avoid mt-1 cursor-pointer"
          onClick={() => {
            navigate(`/post/${post._id}`);
          }}
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full rounded-md border border-gray-200 object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default HomePage;
