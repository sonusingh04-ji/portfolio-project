import { useEffect, useState } from "react";
import {
    Code2,
    Plus,
    Pencil,
    Trash2,
    X,
    Save
} from "lucide-react";

import api from "../services/api";

const emptyForm = {
    name: "",
    category: "",
    proficiency: 0,
    icon: "",
    displayOrder: 0,
    isVisible: true
};

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadSkills = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/skills");

            setSkills(response.data.data || []);
        } catch (err) {
            console.error("Load skills error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load skills"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSkills();
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
        setEditingId(null);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const openEditForm = (skill) => {
        setForm({
            name: skill.name || "",
            category: skill.category || "",
            proficiency: skill.proficiency ?? 0,
            icon: skill.icon || "",
            displayOrder: skill.display_order ?? 0,
            isVisible: skill.is_visible ?? true
        });

        setEditingId(skill.id);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const closeForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        const payload = {
            name: form.name.trim(),
            category: form.category.trim() || null,
            proficiency: Number(form.proficiency),
            icon: form.icon.trim() || null,
            displayOrder: Number(form.displayOrder),
            isVisible: form.isVisible
        };

        if (!payload.name) {
            setError("Skill name is required");
            setSaving(false);
            return;
        }

        if (
            payload.proficiency < 0 ||
            payload.proficiency > 100
        ) {
            setError(
                "Proficiency must be between 0 and 100"
            );
            setSaving(false);
            return;
        }

        try {
            if (editingId) {
                await api.put(
                    `/api/skills/${editingId}`,
                    payload
                );

                setSuccess(
                    "Skill updated successfully."
                );
            } else {
                await api.post(
                    "/api/skills",
                    payload
                );

                setSuccess(
                    "Skill created successfully."
                );
            }

            closeForm();
            await loadSkills();
        } catch (err) {
            console.error(
                "Save skill error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to save skill"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (skill) => {
        const confirmed = window.confirm(
            `Delete "${skill.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/api/skills/${skill.id}`
            );

            setSuccess(
                "Skill deleted successfully."
            );

            await loadSkills();
        } catch (err) {
            console.error(
                "Delete skill error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete skill"
            );
        }
    };

    return (
        <div className="p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-slate-900 p-3 text-white">
                            <Code2 size={22} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Skills
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage your technical skills and proficiency.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={openCreateForm}
                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
                    >
                        <Plus size={18} />
                        Add Skill
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
                                        ? "Edit Skill"
                                        : "Add Skill"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Enter the skill information below.
                                </p>
                            </div>

                            <button
                                onClick={closeForm}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
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
                                        Skill Name
                                    </label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Java"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Category
                                    </label>

                                    <input
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        placeholder="Backend"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Proficiency (%)
                                    </label>

                                    <input
                                        type="number"
                                        name="proficiency"
                                        min="0"
                                        max="100"
                                        value={form.proficiency}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Icon
                                    </label>

                                    <input
                                        name="icon"
                                        value={form.icon}
                                        onChange={handleChange}
                                        placeholder="java"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    />
                                </div>

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

                                <div className="flex items-end">
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
                                            ? "Update Skill"
                                            : "Create Skill"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Skills table */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-lg font-semibold text-slate-900">
                            All Skills
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {skills.length} skill
                            {skills.length === 1 ? "" : "s"} available.
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-500">
                            Loading skills...
                        </div>
                    ) : skills.length === 0 ? (
                        <div className="p-12 text-center">
                            <Code2
                                size={40}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                No skills yet
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Add your first skill to get started.
                            </p>

                            <button
                                onClick={openCreateForm}
                                className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                Add Skill
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">

                                <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Skill
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Category
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Proficiency
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Visibility
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200">
                                {skills.map((skill) => (
                                    <tr
                                        key={skill.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="font-semibold text-slate-900">
                                                {skill.name}
                                            </div>

                                            {skill.icon && (
                                                <div className="mt-1 text-xs text-slate-400">
                                                    {skill.icon}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            {skill.category || "—"}
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                                                    <div
                                                        className="h-full rounded-full bg-slate-900"
                                                        style={{
                                                            width: `${skill.proficiency || 0}%`
                                                        }}
                                                    />
                                                </div>

                                                <span className="text-sm font-medium text-slate-700">
                                                        {skill.proficiency ?? 0}%
                                                    </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            {skill.is_visible ? (
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                        Visible
                                                    </span>
                                            ) : (
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                        Hidden
                                                    </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex justify-end gap-2">

                                                <button
                                                    onClick={() =>
                                                        openEditForm(skill)
                                                    }
                                                    className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                    title="Edit"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(skill)
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

export default Skills;