
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BlogCard({
  blog,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  if (!blog) return null;

  const title = blog.title || "Untitled Story";
  const content = blog.content || "";
  const author = blog.author || "Anonymous";
  const category = blog.category || "General";

  const readingMinutes = Math.max(
    1,
    Math.ceil(
      content.trim().split(/\s+/).filter(Boolean).length / 200
    )
  );

  function handleReadMore() {
    if (blog.id !== undefined && blog.id !== null) {
      navigate(`/blog/${blog.id}`);
    }
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/60 hover:shadow-2xl hover:shadow-indigo-950/40">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950">
        {blog.image && !imageError ? (
          <img
            src={blog.image}
            alt={title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-7xl font-black text-indigo-400/60">
              B
            </span>
          </div>
        )}

        {/* Category */}
        <span className="absolute left-4 top-4 max-w-[80%] truncate rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur">
          {category}
        </span>

        {/* Decorative icon */}
        <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 text-lg backdrop-blur">
          ✦
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Author and reading time */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white shadow-lg shadow-indigo-950/40">
              {author.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-200">
                {author}
              </p>
              <p className="text-xs text-slate-500">Author</p>
            </div>
          </div>

          <span className="shrink-0 text-xs text-slate-500">
            {readingMinutes} min read
          </span>
        </div>

        {/* Title */}
        <h2 className="line-clamp-2 text-xl font-bold leading-snug text-white transition-colors duration-200 group-hover:text-indigo-300">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-3 line-clamp-3 flex-1 whitespace-pre-wrap break-words text-sm leading-7 text-slate-400">
          {content || "No content available for this story yet."}
        </p>

        {/* Read More */}
        <button
          type="button"
          onClick={handleReadMore}
          disabled={blog.id === undefined || blog.id === null}
          className="mt-5 flex w-fit items-center gap-2 text-sm font-semibold text-indigo-400 transition-all duration-200 hover:gap-3 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Read full story <span aria-hidden="true">→</span>
        </button>

        {/* Existing CRUD actions */}
        {(onEdit || onDelete) && (
          <div className="mt-5 flex gap-3 border-t border-slate-800 pt-4">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(blog)}
                className="flex-1 rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-300"
              >
                ✎ Edit
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(blog.id)}
                className="flex-1 rounded-xl border border-rose-900/60 px-3 py-2.5 text-sm font-semibold text-rose-400 transition hover:border-rose-500 hover:bg-rose-500/10"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
