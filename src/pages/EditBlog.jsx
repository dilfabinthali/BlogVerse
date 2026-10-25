
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs, updateBlog } = useBlogs();

  const blog = blogs.find((item) => item.id === Number(id));

  const [form, setForm] = useState(() =>
    blog
      ? {
          title: blog.title,
          category: blog.category,
          author: blog.author,
          excerpt: blog.excerpt,
          image: blog.image || "",
        }
      : null
  );

  const [error, setError] = useState("");

  if (!blog || !form) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Blog Not Found
        </h1>
        <Link
          to="/"
          className="mt-4 inline-block font-semibold text-violet-600"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.category.trim() ||
      !form.author.trim() ||
      !form.excerpt.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    updateBlog(id, {
      ...form,
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
    });

    navigate(`/blog/${id}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-2xl">
        <Link
          to={`/blog/${id}`}
          className="font-semibold text-violet-600 hover:text-violet-800"
        >
          ← Back to Blog
        </Link>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <h1 className="text-3xl font-extrabold">Edit Blog</h1>
          <p className="mt-2 text-sm text-slate-500">
            Update your story and save your changes.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Blog Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Programming">Programming</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Author *
              </label>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Description *
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={6}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Image URL
              </label>
              <input
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 px-5 py-3 font-bold text-white transition hover:bg-violet-700"
            >
              Save Changes
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default EditBlog;
