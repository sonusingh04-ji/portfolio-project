import { useEffect, useState } from "react";
import {
    FolderKanban,
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    ExternalLink,
    GitBranch,
    Star
} from "lucide-react";

import api from "../services/api";

const emptyForm = {
    title: "",
    slug: "",
    description: "",
    imageUrl: "",
    liveUrl: "",
    githubUrl: "",
    techStack: [],
    featured: false,
    displayOrder: 0,
    isPublished: true
};

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [techInput, setTechInput] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/projects");

            setProjects(response.data.data || []);
        } catch (err) {
            console.error("Load projects error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load projects"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } =
            event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    const openCreateForm = () => {
        setForm(emptyForm);
        setTechInput("");
        setEditingId(null);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const openEditForm = (project) => {
        setForm({
            title: project.title || "",
            slug: project.slug || "",
            description: project.description || "",
            imageUrl: project.image_url || "",
            liveUrl: project.live_url || "",
            githubUrl: project.github_url || "",
            techStack: project.tech_stack || [],
            featured: project.featured ?? false,
            displayOrder: project.display_order ?? 0,
            isPublished: project.is_published ?? true
        });

        setTechInput("");
        setEditingId(project.id);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const closeForm = () => {
        setForm(emptyForm);
        setTechInput("");
        setEditingId(null);
        setShowForm(false);
    };

    const addTechnology = () => {
        const technology = techInput.trim();

        if (!technology) {
            return;
        }

        if (
            form.techStack.some(
                (item) =>
                    item.toLowerCase() ===
                    technology.toLowerCase()
            )
        ) {
            setTechInput("");
            return;
        }

        setForm((previous) => ({
            ...previous,
            techStack: [
                ...previous.techStack,
                technology
            ]
        }));

        setTechInput("");
    };

    const removeTechnology = (technologyToRemove) => {
        setForm((previous) => ({
            ...previous,
            techStack: previous.techStack.filter(
                (technology) =>
                    technology !== technologyToRemove
            )
        }));
    };

    const handleTechKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addTechnology();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        if (!form.title.trim()) {
            setError("Project title is required");
            setSaving(false);
            return;
        }

        if (!form.slug.trim()) {
            setError("Project slug is required");
            setSaving(false);
            return;
        }

        if (!form.description.trim()) {
            setError("Project description is required");
            setSaving(false);
            return;
        }

        const payload = {
            title: form.title.trim(),
            slug: form.slug.trim(),
            description: form.description.trim(),
            imageUrl: form.imageUrl.trim() || null,
            liveUrl: form.liveUrl.trim() || null,
            githubUrl: form.githubUrl.trim() || null,
            techStack: form.techStack,
            featured: form.featured,
            displayOrder: Number(form.displayOrder),
            isPublished: form.isPublished
        };

        try {
            if (editingId) {
                await api.put(
                    `/api/projects/${editingId}`,
                    payload
                );

                setSuccess(
                    "Project updated successfully."
                );
            } else {
                await api.post(
                    "/api/projects",
                    payload
                );

                setSuccess(
                    "Project created successfully."
                );
            }

            closeForm();
            await loadProjects();
        } catch (err) {
            console.error(
                "Save project error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to save project"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (project) => {
        const confirmed = window.confirm(
            `Delete "${project.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/api/projects/${project.id}`
            );

            setSuccess(
                "Project deleted successfully."
            );

            await loadProjects();
        } catch (err) {
            console.error(
                "Delete project error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete project"
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
                            <FolderKanban size={22} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Projects
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage the projects displayed on your portfolio.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={openCreateForm}
                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
                    >
                        <Plus size={18} />
                        Add Project
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
                                        ? "Edit Project"
                                        : "Add Project"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Enter your project details.
                                </p>
                            </div>

                            <button
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

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Project Title
                                    </label>

                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="AgriNexus"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Slug
                                    </label>

                                    <input
                                        name="slug"
                                        value={form.slug}
                                        onChange={handleChange}
                                        placeholder="agrinexus"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        required
                                    />

                                    <p className="mt-1 text-xs text-slate-400">
                                        Example: my-awesome-project
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Describe what you built..."
                                        className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Project Image URL
                                    </label>

                                    <input
                                        name="imageUrl"
                                        value={form.imageUrl}
                                        onChange={handleChange}
                                        placeholder="http://localhost:5001/uploads/..."
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Live URL
                                    </label>

                                    <div className="relative">
                                        <ExternalLink
                                            size={17}
                                            className="absolute left-3 top-3.5 text-slate-400"
                                        />

                                        <input
                                            name="liveUrl"
                                            value={form.liveUrl}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                            className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-slate-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        GitHub URL
                                    </label>

                                    <div className="relative">
                                        <GitBranch
                                            size={17}
                                            className="absolute left-3 top-3.5 text-slate-400"
                                        />

                                        <input
                                            name="githubUrl"
                                            value={form.githubUrl}
                                            onChange={handleChange}
                                            placeholder="https://github.com/..."
                                            className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-slate-900"
                                        />
                                    </div>
                                </div>

                                {/* Technologies */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Technologies
                                    </label>

                                    <div className="flex gap-2">
                                        <input
                                            value={techInput}
                                            onChange={(event) =>
                                                setTechInput(
                                                    event.target.value
                                                )
                                            }
                                            onKeyDown={
                                                handleTechKeyDown
                                            }
                                            placeholder="React.js"
                                            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                addTechnology
                                            }
                                            className="rounded-lg border border-slate-300 px-4 py-3 font-medium hover:bg-slate-50"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {form.techStack.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {form.techStack.map(
                                                (technology) => (
                                                    <span
                                                        key={
                                                            technology
                                                        }
                                                        className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                                                    >
                                                        {
                                                            technology
                                                        }

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeTechnology(
                                                                    technology
                                                                )
                                                            }
                                                            className="text-slate-400 hover:text-red-500"
                                                        >
                                                            <X
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                        </button>
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

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

                                <div className="flex items-end gap-6">

                                    <label className="flex cursor-pointer items-center gap-3">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={form.featured}
                                            onChange={handleChange}
                                            className="h-4 w-4"
                                        />

                                        <span className="text-sm font-medium text-slate-700">
                                            Featured
                                        </span>
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-3">
                                        <input
                                            type="checkbox"
                                            name="isPublished"
                                            checked={form.isPublished}
                                            onChange={handleChange}
                                            className="h-4 w-4"
                                        />

                                        <span className="text-sm font-medium text-slate-700">
                                            Published
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
                                            ? "Update Project"
                                            : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Project Table */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-lg font-semibold text-slate-900">
                            All Projects
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {projects.length} project
                            {projects.length === 1 ? "" : "s"} available.
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-500">
                            Loading projects...
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="p-12 text-center">
                            <FolderKanban
                                size={40}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                No projects yet
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Add your first project.
                            </p>

                            <button
                                onClick={openCreateForm}
                                className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                            >
                                Add Project
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">

                                <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Project
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Tech Stack
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Featured
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200">
                                {projects.map(
                                    (project) => (
                                        <tr
                                            key={
                                                project.id
                                            }
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">

                                                    {project.image_url ? (
                                                        <img
                                                            src={
                                                                project.image_url
                                                            }
                                                            alt={
                                                                project.title
                                                            }
                                                            className="h-14 w-20 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-100">
                                                            <FolderKanban
                                                                size={
                                                                    22
                                                                }
                                                                className="text-slate-400"
                                                            />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <div className="flex items-center gap-2 font-semibold text-slate-900">
                                                            {
                                                                project.title
                                                            }

                                                            {project.featured && (
                                                                <Star
                                                                    size={
                                                                        15
                                                                    }
                                                                    className="fill-current"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="mt-1 text-xs text-slate-400">
                                                            /
                                                            {
                                                                project.slug
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex max-w-xs flex-wrap gap-1.5">
                                                    {(
                                                        project.tech_stack ||
                                                        []
                                                    )
                                                        .slice(
                                                            0,
                                                            4
                                                        )
                                                        .map(
                                                            (
                                                                technology
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        technology
                                                                    }
                                                                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                                                                >
                                                                        {
                                                                            technology
                                                                        }
                                                                    </span>
                                                            )
                                                        )}

                                                    {(
                                                            project.tech_stack ||
                                                            []
                                                        ).length >
                                                        4 && (
                                                            <span className="text-xs text-slate-400">
                                                                +
                                                                {(
                                                                        project.tech_stack ||
                                                                        []
                                                                    ).length -
                                                                    4}
                                                            </span>
                                                        )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                {project.is_published ? (
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                            Published
                                                        </span>
                                                ) : (
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                            Draft
                                                        </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                {project.featured ? (
                                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                                            Featured
                                                        </span>
                                                ) : (
                                                    <span className="text-sm text-slate-400">
                                                            No
                                                        </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        onClick={() =>
                                                            openEditForm(
                                                                project
                                                            )
                                                        }
                                                        className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100"
                                                        title="Edit"
                                                    >
                                                        <Pencil
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                project
                                                            )
                                                        }
                                                        className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Projects;