import { useEffect, useState } from "react";
import {
    MessageSquareQuote,
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    Star
} from "lucide-react";

import api from "../services/api";

const emptyForm = {
    name: "",
    role: "",
    company: "",
    avatarUrl: "",
    content: "",
    rating: 5,
    displayOrder: 0,
    isVisible: true
};

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadTestimonials = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/api/testimonials"
            );

            setTestimonials(response.data.data || []);
        } catch (err) {
            console.error(
                "Load testimonials error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load testimonials"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTestimonials();
    }, []);

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    const openCreateForm = () => {
        setForm({
            ...emptyForm
        });

        setEditingId(null);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const openEditForm = (testimonial) => {
        setForm({
            name: testimonial.name || "",
            role: testimonial.role || "",
            company: testimonial.company || "",
            avatarUrl: testimonial.avatar_url || "",
            content: testimonial.content || "",
            rating: testimonial.rating ?? 5,
            displayOrder:
                testimonial.display_order ?? 0,
            isVisible:
                testimonial.is_visible ?? true
        });

        setEditingId(testimonial.id);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const closeForm = () => {
        setForm({
            ...emptyForm
        });

        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        const rating = Number(form.rating);

        if (!form.name.trim()) {
            setError("Name is required");
            setSaving(false);
            return;
        }

        if (!form.content.trim()) {
            setError("Testimonial content is required");
            setSaving(false);
            return;
        }

        if (
            rating < 1 ||
            rating > 5
        ) {
            setError(
                "Rating must be between 1 and 5"
            );
            setSaving(false);
            return;
        }

        const payload = {
            name: form.name.trim(),
            role: form.role.trim() || null,
            company: form.company.trim() || null,
            avatarUrl:
                form.avatarUrl.trim() || null,
            content: form.content.trim(),
            rating,
            displayOrder:
                Number(form.displayOrder),
            isVisible: form.isVisible
        };

        try {
            if (editingId) {
                await api.put(
                    `/api/testimonials/${editingId}`,
                    payload
                );

                setSuccess(
                    "Testimonial updated successfully."
                );
            } else {
                await api.post(
                    "/api/testimonials",
                    payload
                );

                setSuccess(
                    "Testimonial created successfully."
                );
            }

            closeForm();
            await loadTestimonials();
        } catch (err) {
            console.error(
                "Save testimonial error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to save testimonial"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (testimonial) => {
        const confirmed = window.confirm(
            `Delete testimonial from "${testimonial.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/api/testimonials/${testimonial.id}`
            );

            setSuccess(
                "Testimonial deleted successfully."
            );

            await loadTestimonials();
        } catch (err) {
            console.error(
                "Delete testimonial error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete testimonial"
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
                            <MessageSquareQuote size={22} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Testimonials
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage client and mentor testimonials.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={openCreateForm}
                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
                    >
                        <Plus size={18} />
                        Add Testimonial
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
                                        ? "Edit Testimonial"
                                        : "Add Testimonial"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add feedback to display on your portfolio.
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

                                {/* Name */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Name
                                    </label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Rahul Sharma"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        required
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Role
                                    </label>

                                    <input
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                        placeholder="Project Mentor"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    />
                                </div>

                                {/* Company */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Company
                                    </label>

                                    <input
                                        name="company"
                                        value={form.company}
                                        onChange={handleChange}
                                        placeholder="Labmentix"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    />
                                </div>

                                {/* Avatar */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Avatar URL
                                    </label>

                                    <input
                                        name="avatarUrl"
                                        value={form.avatarUrl}
                                        onChange={handleChange}
                                        placeholder="http://localhost:5001/uploads/..."
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    />
                                </div>

                                {/* Content */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Testimonial
                                    </label>

                                    <textarea
                                        name="content"
                                        value={form.content}
                                        onChange={handleChange}
                                        rows={6}
                                        placeholder="Write the testimonial..."
                                        className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        required
                                    />
                                </div>

                                {/* Rating */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Rating
                                    </label>

                                    <select
                                        name="rating"
                                        value={form.rating}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
                                    >
                                        <option value="5">
                                            5 Stars
                                        </option>

                                        <option value="4">
                                            4 Stars
                                        </option>

                                        <option value="3">
                                            3 Stars
                                        </option>

                                        <option value="2">
                                            2 Stars
                                        </option>

                                        <option value="1">
                                            1 Star
                                        </option>
                                    </select>
                                </div>

                                {/* Display order */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Display Order
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="displayOrder"
                                        value={form.displayOrder}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    />
                                </div>

                                {/* Visibility */}
                                <div className="md:col-span-2">
                                    <label className="flex cursor-pointer items-center gap-3">
                                        <input
                                            type="checkbox"
                                            name="isVisible"
                                            checked={form.isVisible}
                                            onChange={handleChange}
                                            className="h-4 w-4"
                                        />

                                        <span className="text-sm font-medium text-slate-700">
                                            Visible on portfolio
                                        </span>
                                    </label>
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
                                            ? "Update Testimonial"
                                            : "Create Testimonial"}
                                </button>

                            </div>

                        </form>
                    </div>
                )}

                {/* List */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-lg font-semibold text-slate-900">
                            All Testimonials
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {testimonials.length} testimonial
                            {testimonials.length === 1
                                ? ""
                                : "s"} available.
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-500">
                            Loading testimonials...
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="p-12 text-center">

                            <MessageSquareQuote
                                size={40}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                No testimonials yet
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Add your first testimonial.
                            </p>

                            <button
                                onClick={openCreateForm}
                                className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                Add Testimonial
                            </button>

                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200">

                            {testimonials.map(
                                (testimonial) => (
                                    <div
                                        key={
                                            testimonial.id
                                        }
                                        className="p-6 hover:bg-slate-50"
                                    >

                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                                            <div className="flex min-w-0 gap-4">

                                                {testimonial.avatar_url ? (
                                                    <img
                                                        src={
                                                            testimonial.avatar_url
                                                        }
                                                        alt={
                                                            testimonial.name
                                                        }
                                                        className="h-14 w-14 shrink-0 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-600">
                                                        {testimonial.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>
                                                )}

                                                <div className="min-w-0">

                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="font-semibold text-slate-900">
                                                            {
                                                                testimonial.name
                                                            }
                                                        </h3>

                                                        {testimonial.is_visible ? (
                                                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                                Visible
                                                            </span>
                                                        ) : (
                                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                                Hidden
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {testimonial.role}

                                                        {testimonial.company && (
                                                            <>
                                                                {" • "}
                                                                {
                                                                    testimonial.company
                                                                }
                                                            </>
                                                        )}
                                                    </p>

                                                    <div className="mt-2 flex items-center gap-1">
                                                        {Array.from(
                                                            {
                                                                length: 5
                                                            }
                                                        ).map(
                                                            (_, index) => (
                                                                <Star
                                                                    key={
                                                                        index
                                                                    }
                                                                    size={
                                                                        16
                                                                    }
                                                                    className={
                                                                        index <
                                                                        (testimonial.rating ||
                                                                            0)
                                                                            ? "fill-current text-amber-400"
                                                                            : "text-slate-300"
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </div>

                                                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                                                        "
                                                        {
                                                            testimonial.content
                                                        }
                                                        "
                                                    </p>

                                                </div>
                                            </div>

                                            <div className="flex shrink-0 gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEditForm(
                                                            testimonial
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
                                                            testimonial
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                )
                            )}

                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Testimonials;