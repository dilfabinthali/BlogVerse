
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import initialBlogs from "../data/blogs";

const BlogContext = createContext(null);

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState(() => {
    try {
      const saved = localStorage.getItem("blogverse-blogs");

      return saved ? JSON.parse(saved) : initialBlogs;
    } catch {
      return initialBlogs;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "blogverse-blogs",
      JSON.stringify(blogs)
    );
  }, [blogs]);

  function addBlog(blog) {
    setBlogs((currentBlogs) => [
      { ...blog, id: Date.now() },
      ...currentBlogs,
    ]);
  }

  function updateBlog(id, updatedBlog) {
    setBlogs((currentBlogs) =>
      currentBlogs.map((blog) =>
        blog.id === Number(id)
          ? { ...blog, ...updatedBlog, id: blog.id }
          : blog
      )
    );
  }

  function deleteBlog(id) {
    setBlogs((currentBlogs) =>
      currentBlogs.filter(
        (blog) => blog.id !== Number(id)
      )
    );
  }

  return (
    <BlogContext.Provider
      value={{ blogs, addBlog, updateBlog, deleteBlog }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlogs() {
  const context = useContext(BlogContext);

  if (!context) {
    throw new Error(
      "useBlogs must be used inside BlogProvider"
    );
  }

  return context;
}
