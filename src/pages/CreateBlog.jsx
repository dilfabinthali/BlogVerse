
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBlog } from "../features/blogs/blogSlice";

function CreateBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "Technology",
    author: "",
    excerpt: "",
    image: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Updated form submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.title.trim() ||
      !form.author.trim() ||
      !form.excerpt.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const newBlog = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      category: form.category,
      author: form.author.trim(),
      excerpt: form.excerpt.trim(),
      image: form.image.trim(),
      createdAt: new Date().toISOString(),
    };

    dispatch(addBlog(newBlog));

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg sm:p-10">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Create a New Blog
        </h1>

        <p className="mb-8 text-gray-500">
          Share your ideas with the BlogVerse community.
        </p>

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-lg bg-red-100 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="mb-2 block font-semibold text-gray-700">
              Blog Title *
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block font-semibold text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
            >
              <option value="Technology">Technology</option>
              <option value="Programming">Programming</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Education">Education</option>
              <option value="Travel">Travel</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div>
            <label htmlFor="author" className="mb-2 block font-semibold text-gray-700">
              Author Name *
            </label>
            <input
              id="author"
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Enter author name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="mb-2 block font-semibold text-gray-700">
              Blog Description *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Write your blog description"
              rows={6}
              required
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="image" className="mb-2 block font-semibold text-gray-700">
              Image URL (Optional)
            </label>
            <input
              id="image"
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Publish Blog
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;
