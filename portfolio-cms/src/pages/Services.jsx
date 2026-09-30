import { useEffect, useState } from "react";
import {
    Wrench,
    Plus,
    Pencil,
    Trash2,
    X,
    Save
} from "lucide-react";

import api from "../services/api";

const emptyForm = {
    title: "",
    slug: "",
    description: "",
    icon: "",
    displayOrder: 0,
    isVisible: true
};

const Services = () => {
    const [services, setServices] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadServices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/api/services"
            );

            setServices(response.data.data || []);
        } catch (err) {
            console.error(
                "Load services error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load services"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
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

    const openEditForm = (service) => {
        setForm({
            title: service.title || "",
            slug: service.slug || "",
            description:
                service.description || "",
            icon: service.icon || "",
            displayOrder:
                service.display_order ?? 0,
            isVisible:
                service.is_visible ?? true
        });

        setEditingId(service.id);
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

        const payload = {
            title: form.title.trim(),
            slug: form.slug.trim(),
            description:
                form.description.trim(),
            icon: form.icon.trim() || null,
            displayOrder:
                Number(form.displayOrder),
            isVisible: form.isVisible
        };

        if (!payload.title) {
            setError("Service title is required");
            setSaving(false);
            return;
        }

        if (!payload.slug) {
            setError("Service slug is required");
            setSaving(false);
            return;
        }

        if (!payload.description) {
            setError(
                "Service description is required"
            );
            setSaving(false);
            return;
        }

        try {
            if (editingId) {
                await api.put(
                    `/api/services/${editingId}`,
                    payload
                );

                setSuccess(
                    "Service updated successfully."
                );
            } else {
                await api.post(
                    "/api/services",
                    payload
                );

                setSuccess(
                    "Service created successfully."
                );
            }

            closeForm();
            await loadServices();
        } catch (err) {
            console.error(
                "Save service error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to save service"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (service) => {
        const confirmed = window.confirm(
            `Delete "${service.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/api/services/${service.id}`
            );

            setSuccess(
                "Service deleted successfully."
            );

            await loadServices();
        } catch (err) {
            console.error(
                "Delete service error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete service"
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
                            <Wrench size={22} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Services
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage the services displayed on your portfolio.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={openCreateForm}
                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
                    >
                        <Plus size={18} />
                        Add Service
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
                                        ? "Edit Service"
                                        : "Add Service"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Enter the service information.
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
                                        Service Title
                                    </label>

                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="Full Stack Development"
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
                                        placeholder="full-stack-development"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        required
                                    />

                                    <p className="mt-1 text-xs text-slate-400">
                                        Example: web-development
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={6}
                                        placeholder="Describe the service you provide..."
                                        className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        required
                                    />
                                </div>

                                {/* Icon */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Icon
                                    </label>

                                    <input
                                        name="icon"
                                        value={form.icon}
                                        onChange={handleChange}
                                        placeholder="code"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    />

                                    <p className="mt-1 text-xs text-slate-400">
                                        Store the icon name used by your portfolio.
                                    </p>
                                </div>

                                {/* Display order */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Display Order
                                    </label>

                                    <input
                                        type="number"
                                        name="displayOrder"
                                        min="0"
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
                                            ? "Update Service"
                                            : "Create Service"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Services List */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-lg font-semibold text-slate-900">
                            All Services
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {services.length} service
                            {services.length === 1
                                ? ""
                                : "s"} available.
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-500">
                            Loading services...
                        </div>
                    ) : services.length === 0 ? (
                        <div className="p-12 text-center">

                            <Wrench
                                size={40}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                No services yet
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Add your first service.
                            </p>

                            <button
                                onClick={openCreateForm}
                                className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                Add Service
                            </button>

                        </div>
                    ) : (
                        <div className="grid gap-5 p-6 md:grid-cols-2">

                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-4">

                                        <div className="flex gap-4">

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                                <Wrench
                                                    size={21}
                                                    className="text-slate-700"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900">
                                                        {
                                                            service.title
                                                        }
                                                    </h3>

                                                    {service.is_visible ? (
                                                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                            Visible
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                            Hidden
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    /{service.slug}
                                                </p>
                                            </div>

                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    openEditForm(
                                                        service
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
                                                        service
                                                    )
                                                }
                                                className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>

                                    </div>

                                    <p className="mt-5 text-sm leading-6 text-slate-600">
                                        {service.description}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                        <div className="text-xs text-slate-400">
                                            Icon:{" "}
                                            {service.icon || "—"}
                                        </div>

                                        <div className="text-xs text-slate-400">
                                            Order:{" "}
                                            {service.display_order}
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Services;