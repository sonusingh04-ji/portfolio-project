import { useEffect, useState } from "react";
import {
    ArrowUpRight,
    BookOpen,
    CalendarDays
} from "lucide-react";

import { Link } from "react-router-dom";
import { getBlogs } from "../services/contentService";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getBlogs();

                const publishedBlogs = (
                    response?.data || []
                )
                    .filter(
                        (blog) =>
                            blog.status === "PUBLISHED"
                    )
                    .sort((a, b) => {
                        const dateA =
                            new Date(
                                a.published_at ||
                                a.created_at ||
                                0
                            ).getTime();

                        const dateB =
                            new Date(
                                b.published_at ||
                                b.created_at ||
                                0
                            ).getTime();

                        return dateB - dateA;
                    });

                setBlogs(publishedBlogs);
            } catch (err) {
                console.error(
                    "Blogs load error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load blog posts."
                );
            } finally {
                setLoading(false);
            }
        };

        loadBlogs();
    }, []);

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    const getExcerpt = (blog) => {
        if (blog.excerpt) {
            return blog.excerpt;
        }

        if (!blog.content) {
            return "";
        }

        const plainText =
            blog.content
                .replace(/<[^>]*>/g, "")
                .replace(/\s+/g, " ")
                .trim();

        if (plainText.length <= 180) {
            return plainText;
        }

        return `${plainText.slice(0, 180)}...`;
    };

    return (
        <main className="bg-white text-slate-950">

            {/* Header */}
            <section className="bg-slate-950 px-6 pb-20 pt-40 text-white lg:px-8">
                <div className="mx-auto max-w-7xl">

                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Journal
                    </p>

                    <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        Ideas, lessons and
                        technical writing.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                        Articles published through the Portfolio CMS.
                    </p>

                </div>
            </section>

            {/* Blog content */}
            <section className="px-6 py-20 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-7xl">

                    {loading && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-500">
                            Loading blog posts...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        blogs.length === 0 && (
                            <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-14 text-center">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
                                    <BookOpen size={30} />
                                </div>

                                <h2 className="mt-6 text-2xl font-bold">
                                    Blog posts coming soon
                                </h2>

                                <p className="mt-3 leading-7 text-slate-500">
                                    Published articles added through
                                    the Portfolio CMS will appear here.
                                </p>

                            </div>
                        )}

                    {!loading &&
                        !error &&
                        blogs.length > 0 && (
                            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

                                {blogs.map((blog) => (
                                    <article
                                        key={blog.id}
                                        className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >

                                        {/* Cover */}
                                        <div className="aspect-[16/10] bg-slate-950">

                                            {blog.cover_image_url ? (
                                                <img
                                                    src={
                                                        blog.cover_image_url
                                                    }
                                                    alt={
                                                        blog.title
                                                    }
                                                    loading="lazy"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-white">

                                                    <div className="text-center">

                                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
                                                            <BookOpen
                                                                size={24}
                                                            />
                                                        </div>

                                                        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                                            Article
                                                        </p>

                                                    </div>

                                                </div>
                                            )}

                                        </div>

                                        {/* Content */}
                                        <div className="p-7">

                                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">

                                                {blog.published_at && (
                                                    <span className="inline-flex items-center gap-2">
                                                        <CalendarDays
                                                            size={14}
                                                        />

                                                        {formatDate(
                                                            blog.published_at
                                                        )}
                                                    </span>
                                                )}

                                                {blog.status && (
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-500">
                                                        {
                                                            blog.status
                                                        }
                                                    </span>
                                                )}

                                            </div>

                                            <h2 className="mt-5 text-2xl font-bold leading-tight">
                                                {blog.title}
                                            </h2>

                                            <p className="mt-4 leading-7 text-slate-600">
                                                {getExcerpt(blog)}
                                            </p>

                                            {Array.isArray(
                                                    blog.tags
                                                ) &&
                                                blog.tags.length > 0 && (
                                                    <div className="mt-6 flex flex-wrap gap-2">

                                                        {blog.tags
                                                            .slice(0, 4)
                                                            .map(
                                                                (tag) => (
                                                                    <span
                                                                        key={
                                                                            tag
                                                                        }
                                                                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                )
                                                            )}

                                                    </div>
                                                )}

                                            <Link
                                                to={`/blog/${blog.slug}`}
                                                className="mt-7 inline-flex items-center gap-2 font-semibold text-slate-950"
                                            >
                                                Read article

                                                <ArrowUpRight
                                                    size={17}
                                                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                />
                                            </Link>

                                        </div>

                                    </article>
                                ))}
                            </div>
                        )}

                </div>
            </section>

        </main>
    );
};

export default Blogs;