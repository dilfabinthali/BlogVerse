
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const savedBlogs = JSON.parse(
        localStorage.getItem("blogverse-blogs") || "[]"
      );

      const foundBlog = savedBlogs.find(
        (item) => String(item.id) === String(id)
      );

      setBlog(foundBlog || null);

      const favorites = JSON.parse(
        localStorage.getItem("blogverse-favorites") || "[]"
      );

      setIsFavorite(favorites.some((item) => String(item) === String(id)));
    } catch {
      setBlog(null);
    }
  }, [id]);

  function toggleFavorite() {
    const favorites = JSON.parse(
      localStorage.getItem("blogverse-favorites") || "[]"
    );

    const updated = isFavorite
      ? favorites.filter((item) => String(item) !== String(id))
      : [...favorites.filter((item) => String(item) !== String(id)), id];

    localStorage.setItem("blogverse-favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  }

  async function shareBlog() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      window.prompt("Copy this blog link:", window.location.href);
    }
  }

  if (!blog) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0B1120] px-6 text-center text-white">
        <span className="text-6xl">📚</span>
        <h1 className="mt-6 text-3xl font-bold">Blog not found</h1>
        <p className="mt-3 text-slate-400">
          This story may have been deleted or is unavailable.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500"
        >
          ← Back to Home
        </Link>
      </main>
    );
  }

  const readingMinutes = Math.max(
    1,
    Math.ceil((blog.content || "").trim().split(/\s+/).filter(Boolean).length / 200)
  );

  return (
    <main className="min-h-screen bg-[#0B1120] text-white">
      <article className="mx-auto max-w-4xl px-6 py-12 sm:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-indigo-300"
        >
          ← Back to all stories
        </Link>

        <div className="mt-10">
          <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300">
            {blog.category || "General"}
          </span>

          <h1 className="mt-7 text-4xl font-black leading-tight sm:text-6xl">
            {blog.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="font-medium text-slate-200">
              By {blog.author || "Anonymous"}
            </span>
            <span>•</span>
            <span>{readingMinutes} min read</span>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={toggleFavorite}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                isFavorite
                  ? "border-pink-500/40 bg-pink-500/10 text-pink-300"
                  : "border-slate-700 text-slate-300 hover:border-pink-500/50"
              }`}
            >
              {isFavorite ? "♥ Saved" : "♡ Save story"}
            </button>

            <button
              onClick={shareBlog}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-indigo-500 hover:text-indigo-300"
            >
              {copied ? "✓ Link copied" : "↗ Share story"}
            </button>
          </div>
        </div>

        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="mt-10 max-h-[480px] w-full rounded-3xl border border-slate-800 object-cover"
          />
        )}

        <div className="mt-10 whitespace-pre-wrap break-words text-lg leading-9 text-slate-300">
          {blog.content}
        </div>

        <div className="mt-14 rounded-2xl border border-slate-800 bg-[#111827] p-6 sm:p-8">
          <p className="text-sm text-slate-400">Written by</p>
          <h2 className="mt-2 text-xl font-bold">
            {blog.author || "Anonymous"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Thanks for taking the time to read this story.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex text-sm font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Discover more stories →
          </Link>
        </div>
      </article>
    </main>
  );
}
