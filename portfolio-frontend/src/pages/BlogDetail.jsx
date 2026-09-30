import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ArrowUpRight,
    BookOpen,
    CalendarDays
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { getBlogs } from "../services/contentService";

const BlogDetail = () => {
    const { slug } = useParams();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadBlog = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getBlogs();

                const publishedBlogs = (
                    response?.data || []
                ).filter(
                    (item) => item.status === "PUBLISHED"
                );

                const foundBlog = publishedBlogs.find(
                    (item) => item.slug === slug
                );

                if (!foundBlog) {
                    setError("Blog post not found.");
                    return;
                }

                setBlog(foundBlog);
            } catch (err) {
                console.error(
                    "Blog detail load error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load blog post."
                );
            } finally {
                setLoading(false);
            }
        };

        loadBlog();
    }, [slug]);

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    };

    if (loading) {
        return (
            <main className="bg-white px-6 py-40">
                <div className="mx-auto max-w-4xl">
                    <p className="text-slate-500">
                        Loading article...
                    </p>
                </div>
            </main>
        );
    }

    if (error || !blog) {
        return (
            <main className="bg-white px-6 py-40">
                <div className="mx-auto max-w-2xl text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                        <BookOpen size={30} />
                    </div>

                    <h1 className="mt-6 text-3xl font-bold">
                        {error || "Blog post not found."}
                    </h1>

                    <Link
                        to="/blog"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white"
                    >
                        <ArrowLeft size={17} />
                        Back to Blog
                    </Link>

                </div>
            </main>
        );
    }

    return (
        <main className="bg-white text-slate-950">

            {/* Header */}
            <section className="bg-slate-950 px-6 pb-20 pt-40 text-white lg:px-8">
                <div className="mx-auto max-w-4xl">

                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Back to Blog
                    </Link>

                    <div className="mt-10">

                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                            Article
                        </p>

                        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            {blog.title}
                        </h1>

                        {blog.excerpt && (
                            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-400">
                                {blog.excerpt}
                            </p>
                        )}

                        <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-400">

                            {blog.published_at && (
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays size={15} />
                                    {formatDate(
                                        blog.published_at
                                    )}
                                </span>
                            )}

                            {Array.isArray(blog.tags) &&
                                blog.tags.length > 0 && (
                                    <span>
                                        {blog.tags.join(" • ")}
                                    </span>
                                )}

                        </div>

                    </div>

                </div>
            </section>

            {/* Cover */}
            {blog.cover_image_url && (
                <section className="px-6 pt-12 lg:px-8">
                    <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl">
                        <img
                            src={blog.cover_image_url}
                            alt={blog.title}
                            className="w-full object-cover"
                        />
                    </div>
                </section>
            )}

            {/* Article */}
            <section className="px-6 py-16 lg:px-8 lg:py-24">
                <article className="mx-auto max-w-3xl">

                    <div
                        className="prose prose-slate prose-lg max-w-none leading-8"
                        dangerouslySetInnerHTML={{
                            __html: blog.content || ""
                        }}
                    />

                    <div className="mt-16 border-t border-slate-200 pt-8">

                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 font-semibold"
                        >
                            <ArrowLeft size={17} />
                            More articles
                        </Link>

                    </div>

                </article>
            </section>

        </main>
    );
};

export default BlogDetail;