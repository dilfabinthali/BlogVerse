
import { useEffect, useMemo, useState } from "react";
import BlogCard from "../components/BlogCard";

const BLOGS_KEY = "blogverse-blogs";
const FAVORITES_KEY = "blogverse-favorites";

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const [blogs, setBlogs] = useState(() =>
    readStorage(BLOGS_KEY, [])
  );

  const [favorites, setFavorites] = useState(() =>
    readStorage(FAVORITES_KEY, [])
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [view, setView] = useState("grid");
  const [showFavorites, setShowFavorites] = useState(false);
  const [deleteBlogId, setDeleteBlogId] = useState(null);

  // Keep the page synchronized with saved blog data.
  useEffect(() => {
    localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const categories = useMemo(() => {
    const values = blogs
      .map((blog) => blog.category)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((blog) =>
        [
          blog.title,
          blog.content,
          blog.author,
          blog.category,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          )
      );
    }

    if (category !== "All") {
      result = result.filter(
        (blog) => blog.category === category
      );
    }

    if (showFavorites) {
      result = result.filter((blog) =>
        favorites.includes(blog.id)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "az") {
        return (a.title || "").localeCompare(b.title || "");
      }

      if (sortBy === "za") {
        return (b.title || "").localeCompare(a.title || "");
      }

      const dateA = new Date(
        a.createdAt || a.created_at || a.date || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || b.created_at || b.date || 0
      ).getTime();

      if (sortBy === "oldest") {
        return dateA - dateB;
      }

      return dateB - dateA;
    });

    return result;
  }, [blogs, search, category, sortBy, showFavorites, favorites]);

  function handleDelete() {
    if (deleteBlogId === null) return;

    setBlogs((currentBlogs) =>
      currentBlogs.filter((blog) => blog.id !== deleteBlogId)
    );

    setFavorites((currentFavorites) =>
      currentFavorites.filter((id) => id !== deleteBlogId)
    );

    setDeleteBlogId(null);
  }

  function handleEdit(blog) {
    window.location.href = `/edit/${blog.id}`;
  }

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id]
    );
  }

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setSortBy("latest");
    setShowFavorites(false);
  }

  return (
    <main className="min-h-screen bg-[#080D1B] text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="mb-4 inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Your ideas. Your stories.
          </p>

          <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Stories that
            <span className="block bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">
              spark ideas.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Explore fresh perspectives, share your knowledge,
            and discover stories worth reading.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/create"
              className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
            >
              + Write a Story
            </a>

            <span className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
              {blogs.length} {blogs.length === 1 ? "story" : "stories"} published
            </span>
          </div>
        </div>
      </section>

      {/* Blog collection */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
              The BlogVerse collection
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Discover stories
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Search, filter, sort, and explore your blogs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowFavorites((value) => !value)}
            aria-pressed={showFavorites}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              showFavorites
                ? "border-pink-400/40 bg-pink-500/15 text-pink-300"
                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {showFavorites ? "♥ Favorites only" : "♡ Show favorites"}
          </button>
        </div>

        {/* Search and filters */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-[#0D1427] p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
            <div>
              <label
                htmlFor="blog-search"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Search
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#080D1B] px-3 focus-within:border-indigo-400">
                <span aria-hidden="true" className="text-slate-500">
                  ⌕
                </span>
                <input
                  id="blog-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title, author, content..."
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="px-1 text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Category
              </label>
              <select
                id="category-filter"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#080D1B] px-3 py-3 text-sm text-slate-200 outline-none focus:border-indigo-400"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sort-blogs"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Sort by
              </label>
              <select
                id="sort-blogs"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#080D1B] px-3 py-3 text-sm text-slate-200 outline-none focus:border-indigo-400"
              >
                <option value="latest">Latest first</option>
                <option value="oldest">Oldest first</option>
                <option value="az">Title: A–Z</option>
                <option value="za">Title: Z–A</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm transition xl:flex-none ${
                  view === "grid"
                    ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-200"
                    : "border-white/10 text-slate-400 hover:bg-white/5"
                }`}
              >
                ▦ Grid
              </button>

              <button
                type="button"
                onClick={() => setView("list")}
                aria-label="List view"
                aria-pressed={view === "list"}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm transition xl:flex-none ${
                  view === "list"
                    ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-200"
                    : "border-white/10 text-slate-400 hover:bg-white/5"
                }`}
              >
                ☰ List
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <p className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredBlogs.length}
              </span>{" "}
              of {blogs.length} stories
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
            >
              Reset filters
            </button>
          </div>
        </div>

        {/* Results */}
        {filteredBlogs.length > 0 ? (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                : "flex flex-col gap-5"
            }
          >
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="relative">
                <button
                  type="button"
                  onClick={() => toggleFavorite(blog.id)}
                  aria-label={
                    favorites.includes(blog.id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  aria-pressed={favorites.includes(blog.id)}
                  title={
                    favorites.includes(blog.id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-[#080D1B]/90 px-3 py-2 text-lg shadow-lg transition hover:scale-105"
                >
                  <span
                    className={
                      favorites.includes(blog.id)
                        ? "text-pink-400"
                        : "text-slate-300"
                    }
                  >
                    {favorites.includes(blog.id) ? "♥" : "♡"}
                  </span>
                </button>

                <div
                  className={
                    view === "list"
                      ? "[&>article]:grid [&>article]:grid-cols-1 [&>article]:gap-4 sm:[&>article]:grid-cols-[220px_minmax(0,1fr)] [&_img]:h-48 sm:[&_img]:h-full"
                      : ""
                  }
                >
                  <BlogCard
                    blog={blog}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteBlogId(id)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 bg-[#0D1427] px-6 py-16 text-center">
            <div className="mb-4 text-4xl" aria-hidden="true">
              {blogs.length === 0 ? "✦" : "⌕"}
            </div>

            <h3 className="text-xl font-bold text-white">
              {blogs.length === 0
                ? "Your story journey starts here"
                : "No stories found"}
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              {blogs.length === 0
                ? "Create your first blog and let your ideas come to life."
                : "Try another search term or reset your filters to see more stories."}
            </p>

            {blogs.length === 0 ? (
              <a
                href="/create"
                className="mt-6 inline-flex rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400"
              >
                Create your first blog
              </a>
            ) : (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400"
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* Delete confirmation */}
      {deleteBlogId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteBlogId(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#10182D] p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-2xl text-red-300">
              !
            </div>

            <h3
              id="delete-dialog-title"
              className="text-xl font-bold text-white"
            >
              Delete this story?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              This will permanently remove the blog from your saved collection.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteBlogId(null)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400"
              >
                Delete story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-8 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-indigo-300">BlogVerse</span>
          {" "}· A universe of stories.
        </p>
      </footer>
    </main>
  );
}
