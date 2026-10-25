
import { useEffect } from "react";
import { useSelector } from "react-redux";

function LocalStorageSync() {
  const blogs = useSelector((state) => state.blogs.blogs);

  useEffect(() => {
    localStorage.setItem(
      "blogverse-blogs",
      JSON.stringify(blogs)
    );
  }, [blogs]);

  return null;
}

export default LocalStorageSync;
