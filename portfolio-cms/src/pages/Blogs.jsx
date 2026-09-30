import { useEffect, useState } from "react";
import {
    FileText,
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    CalendarDays
} from "lucide-react";

import api from "../services/api";

const emptyForm = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    tags: [],
    status: "DRAFT"
};

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [tagInput, setTagInput] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.get("/api/blogs/admin");

                setBlogs(response.data.data || []);
            } catch (err) {
                console.error("Load blogs error:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load blogs"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const response = await api.get("/api/blogs/admin");

            setBlogs(response.data.data || []);
        } catch (err) {
            console.error("Reload blogs error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load blogs"
            );
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const openCreateForm = () => {
        setForm({
            ...emptyForm,
            tags: []
        });

        setTagInput("");
        setEditingId(null);
        setShowForm(true);

        setError("");
        setSuccess("");
    };

    const openEditForm = (blog) => {
        setForm({
            title: blog.title || "",
            slug: blog.slug || "",
            excerpt: blog.excerpt || "",
            content: blog.content || "",
            coverImageUrl: blog.cover_image_url || "",
            tags: blog.tags || [],
            status: blog.status || "DRAFT"
        });

        setTagInput("");
        setEditingId(blog.id);
        setShowForm(true);

        setError("");
        setSuccess("");
    };

    const closeForm = () => {
        setForm({
            ...emptyForm,
            tags: []
        });

        setTagInput("");
        setEditingId(null);
        setShowForm(false);
    };

    const addTag = () => {
        const tag = tagInput.trim();

        if (!tag) {
            return;
        }

        const exists = form.tags.some(
            (item) =>
                item.toLowerCase() === tag.toLowerCase()
        );

        if (exists) {
            setTagInput("");
            return;
        }

        setForm((previous) => ({
            ...previous,
            tags: [...previous.tags, tag]
        }));

        setTagInput("");
    };

    const removeTag = (tagToRemove) => {
        setForm((previous) => ({
            ...previous,
            tags: previous.tags.filter(
                (tag) => tag !== tagToRemove
            )
        }));
    };

    const handleTagKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addTag();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        const payload = {
            title: form.title.trim(),
            slug: form.slug.trim(),
            excerpt: form.excerpt.trim() || null,
            content: form.content.trim(),
            coverImageUrl:
                form.coverImageUrl.trim() || null,
            tags: form.tags,
            status: form.status
        };

        if (!payload.title) {
            setError("Blog title is required");
            setSaving(false);
            return;
        }

        if (!payload.slug) {
            setError("Blog slug is required");
            setSaving(false);
            return;
        }

        if (!payload.content) {
            setError("Blog content is required");
            setSaving(false);
            return;
        }

        try {
            if (editingId) {
                await api.put(
                    `/api/blogs/${editingId}`,
                    payload
                );

                setSuccess(
                    "Blog updated successfully."
                );
            } else {
                await api.post(
                    "/api/blogs",
                    payload
                );

                setSuccess(
                    "Blog created successfully."
                );
            }

            closeForm();
            await loadBlogs();
        } catch (err) {
            console.error(
                "Save blog error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to save blog"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (blog) => {
        const confirmed = window.confirm(
            `Delete "${blog.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/api/blogs/${blog.id}`
            );

            setSuccess(
                "Blog deleted successfully."
            );

            await loadBlogs();
        } catch (err) {
            console.error(
                "Delete blog error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete blog"
            );
        }
    };

    return (
        <div className="p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-slate-900 p-3 text-white">
                            <FileText size={22} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Blogs
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Create and manage your portfolio articles.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={openCreateForm}
                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
                    >
                        <Plus size={18} />
                        Add Blog
                    </button>
                </div>

                {/* Alerts */}
                {success && (
                    <div className="mt-6 rounded-xl bg-green-50 px-5 py-4 text-sm text-green-700">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Form */}
                {showForm && (
                    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {editingId
                                        ? "Edit Blog"
                                        : "Add Blog"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Write and publish your article.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeForm}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6"
                        >

                            <div className="grid gap-5 md:grid-cols-2">

                                {/* Title */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Title
                                    </label>

                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="Building a Portfolio CMS"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        required
                                    />
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Slug
                                    </label>

                                    <input
                                        name="slug"
                                        value={form.slug}
                                        onChange={handleChange}
                                        placeholder="building-a-portfolio-cms"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        required
                                    />
                                </div>

                                {/* Excerpt */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Excerpt
                                    </label>

                                    <textarea
                                        name="excerpt"
                                        value={form.excerpt}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="A short introduction to the article..."
                                        className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    />
                                </div>

                                {/* Content */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Content
                                    </label>

                                    <textarea
                                        name="content"
                                        value={form.content}
                                        onChange={handleChange}
                                        rows={12}
                                        placeholder="Write your complete blog content here..."
                                        className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm outline-none focus:border-slate-900"
                                        required
                                    />

                                    <p className="mt-1 text-xs text-slate-400">
                                        Rich text editor can be added later.
                                    </p>
                                </div>

                                {/* Cover image */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Cover Image URL
                                    </label>

                                    <input
                                        name="coverImageUrl"
                                        value={form.coverImageUrl}
                                        onChange={handleChange}
                                        placeholder="http://localhost:5001/uploads/..."
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    />

                                    {form.coverImageUrl && (
                                        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                                            <img
                                                src={form.coverImageUrl}
                                                alt="Blog cover preview"
                                                className="max-h-64 w-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Tags
                                    </label>

                                    <div className="flex gap-2">
                                        <input
                                            value={tagInput}
                                            onChange={(event) =>
                                                setTagInput(
                                                    event.target.value
                                                )
                                            }
                                            onKeyDown={
                                                handleTagKeyDown
                                            }
                                            placeholder="React.js"
                                            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        />

                                        <button
                                            type="button"
                                            onClick={addTag}
                                            className="rounded-lg border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {form.tags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {form.tags.map(
                                                (tag) => (
                                                    <span
                                                        key={tag}
                                                        className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                                                    >
                                                        {tag}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeTag(
                                                                    tag
                                                                )
                                                            }
                                                            className="text-slate-400 hover:text-red-500"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
                                    >
                                        <option value="DRAFT">
                                            Draft
                                        </option>

                                        <option value="PUBLISHED">
                                            Published
                                        </option>
                                    </select>
                                </div>

                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                                >
                                    <Save size={18} />

                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Blog"
                                            : "Create Blog"}
                                </button>
                            </div>

                        </form>
                    </div>
                )}

                {/* Blog list */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-lg font-semibold text-slate-900">
                            All Blogs
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {blogs.length} blog
                            {blogs.length === 1 ? "" : "s"} available.
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-500">
                            Loading blogs...
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText
                                size={40}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                No blogs yet
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Create your first article.
                            </p>

                            <button
                                onClick={openCreateForm}
                                className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                Add Blog
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">

                                <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Blog
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Tags
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Published
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200">
                                {blogs.map((blog) => (
                                    <tr
                                        key={blog.id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">

                                                {blog.cover_image_url ? (
                                                    <img
                                                        src={
                                                            blog.cover_image_url
                                                        }
                                                        alt={
                                                            blog.title
                                                        }
                                                        className="h-14 w-20 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-100">
                                                        <FileText
                                                            size={
                                                                22
                                                            }
                                                            className="text-slate-400"
                                                        />
                                                    </div>
                                                )}

                                                <div className="min-w-0">
                                                    <div className="font-semibold text-slate-900">
                                                        {blog.title}
                                                    </div>

                                                    <div className="mt-1 max-w-md truncate text-xs text-slate-400">
                                                        /
                                                        {blog.slug}
                                                    </div>

                                                    {blog.excerpt && (
                                                        <div className="mt-1 max-w-md truncate text-sm text-slate-500">
                                                            {
                                                                blog.excerpt
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex max-w-xs flex-wrap gap-1.5">
                                                {(blog.tags || [])
                                                    .slice(0, 3)
                                                    .map(
                                                        (tag) => (
                                                            <span
                                                                key={
                                                                    tag
                                                                }
                                                                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                                                            >
                                                                    {
                                                                        tag
                                                                    }
                                                                </span>
                                                        )
                                                    )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            {blog.status ===
                                            "PUBLISHED" ? (
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                        Published
                                                    </span>
                                            ) : (
                                                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                                        Draft
                                                    </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-5">
                                            {blog.published_at ? (
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <CalendarDays
                                                        size={16}
                                                    />

                                                    {new Date(
                                                        blog.published_at
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400">
                                                        Not published
                                                    </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex justify-end gap-2">

                                                <button
                                                    onClick={() =>
                                                        openEditForm(
                                                            blog
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100"
                                                    title="Edit"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            blog
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={17} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Blogs;