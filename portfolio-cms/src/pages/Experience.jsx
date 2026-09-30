import { useEffect, useState } from "react";
import {
    BriefcaseBusiness,
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    CalendarDays
} from "lucide-react";

import api from "../services/api";

const emptyForm = {
    company: "",
    position: "",
    location: "",
    employmentType: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    technologies: [],
    displayOrder: 0
};

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const [form, setForm] = useState({
        ...emptyForm,
        technologies: []
    });

    const [technologyInput, setTechnologyInput] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadExperiences = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/experience");

            setExperiences(response.data.data || []);
        } catch (err) {
            console.error("Load experience error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load experience"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExperiences();
    }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const openCreateForm = () => {
        setForm({
            ...emptyForm,
            technologies: []
        });

        setTechnologyInput("");
        setEditingId(null);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const openEditForm = (experience) => {
        setForm({
            company: experience.company || "",
            position: experience.position || "",
            location: experience.location || "",
            employmentType:
                experience.employment_type || "",
            startDate:
                experience.start_date
                    ? String(experience.start_date).slice(0, 10)
                    : "",
            endDate:
                experience.end_date
                    ? String(experience.end_date).slice(0, 10)
                    : "",
            isCurrent: experience.is_current ?? false,
            description: experience.description || "",
            technologies: experience.technologies || [],
            displayOrder: experience.display_order ?? 0
        });

        setTechnologyInput("");
        setEditingId(experience.id);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const closeForm = () => {
        setForm({
            ...emptyForm,
            technologies: []
        });

        setTechnologyInput("");
        setEditingId(null);
        setShowForm(false);
    };

    const addTechnology = () => {
        const technology = technologyInput.trim();

        if (!technology) {
            return;
        }

        const exists = form.technologies.some(
            (item) =>
                item.toLowerCase() ===
                technology.toLowerCase()
        );

        if (exists) {
            setTechnologyInput("");
            return;
        }

        setForm((previous) => ({
            ...previous,
            technologies: [
                ...previous.technologies,
                technology
            ]
        }));

        setTechnologyInput("");
    };

    const removeTechnology = (technologyToRemove) => {
        setForm((previous) => ({
            ...previous,
            technologies: previous.technologies.filter(
                (technology) =>
                    technology !== technologyToRemove
            )
        }));
    };

    const handleTechnologyKeyDown = (event) => {
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

        if (!form.company.trim()) {
            setError("Company is required");
            setSaving(false);
            return;
        }

        if (!form.position.trim()) {
            setError("Position is required");
            setSaving(false);
            return;
        }

        if (!form.startDate) {
            setError("Start date is required");
            setSaving(false);
            return;
        }

        if (form.isCurrent && form.endDate) {
            setError(
                "End date must be empty for a current position"
            );
            setSaving(false);
            return;
        }

        const payload = {
            company: form.company.trim(),
            position: form.position.trim(),
            location: form.location.trim() || null,
            employmentType:
                form.employmentType.trim() || null,
            startDate: form.startDate,
            endDate:
                form.isCurrent
                    ? null
                    : form.endDate || null,
            isCurrent: form.isCurrent,
            description:
                form.description.trim() || null,
            technologies: form.technologies,
            displayOrder: Number(form.displayOrder)
        };

        try {
            if (editingId) {
                await api.put(
                    `/api/experience/${editingId}`,
                    payload
                );

                setSuccess(
                    "Experience updated successfully."
                );
            } else {
                await api.post(
                    "/api/experience",
                    payload
                );

                setSuccess(
                    "Experience created successfully."
                );
            }

            closeForm();
            await loadExperiences();
        } catch (err) {
            console.error(
                "Save experience error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to save experience"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (experience) => {
        const confirmed = window.confirm(
            `Delete "${experience.position}" at "${experience.company}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/api/experience/${experience.id}`
            );

            setSuccess(
                "Experience deleted successfully."
            );

            await loadExperiences();
        } catch (err) {
            console.error(
                "Delete experience error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete experience"
            );
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "Present";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                month: "short",
                year: "numeric"
            }
        );
    };

    return (
        <div className="p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-slate-900 p-3 text-white">
                            <BriefcaseBusiness size={22} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Experience
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage your professional experience and timeline.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={openCreateForm}
                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
                    >
                        <Plus size={18} />
                        Add Experience
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
                                        ? "Edit Experience"
                                        : "Add Experience"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add a role to your professional timeline.
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
                                        Company
                                    </label>

                                    <input
                                        name="company"
                                        value={form.company}
                                        onChange={handleChange}
                                        placeholder="Labmentix"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Position
                                    </label>

                                    <input
                                        name="position"
                                        value={form.position}
                                        onChange={handleChange}
                                        placeholder="Full Stack Developer Intern"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Location
                                    </label>

                                    <input
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        placeholder="Remote"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Employment Type
                                    </label>

                                    <select
                                        name="employmentType"
                                        value={form.employmentType}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
                                    >
                                        <option value="">
                                            Select type
                                        </option>

                                        <option value="Internship">
                                            Internship
                                        </option>

                                        <option value="Full-time">
                                            Full-time
                                        </option>

                                        <option value="Part-time">
                                            Part-time
                                        </option>

                                        <option value="Contract">
                                            Contract
                                        </option>

                                        <option value="Freelance">
                                            Freelance
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Start Date
                                    </label>

                                    <div className="relative">
                                        <CalendarDays
                                            size={17}
                                            className="absolute left-3 top-3.5 text-slate-400"
                                        />

                                        <input
                                            type="date"
                                            name="startDate"
                                            value={form.startDate}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-slate-900"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        End Date
                                    </label>

                                    <div className="relative">
                                        <CalendarDays
                                            size={17}
                                            className="absolute left-3 top-3.5 text-slate-400"
                                        />

                                        <input
                                            type="date"
                                            name="endDate"
                                            value={form.endDate}
                                            onChange={handleChange}
                                            disabled={form.isCurrent}
                                            className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-slate-900 disabled:bg-slate-100"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex cursor-pointer items-center gap-3">
                                        <input
                                            type="checkbox"
                                            name="isCurrent"
                                            checked={form.isCurrent}
                                            onChange={handleChange}
                                            className="h-4 w-4"
                                        />

                                        <span className="text-sm font-medium text-slate-700">
                                            This is my current position
                                        </span>
                                    </label>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={6}
                                        placeholder="Describe your responsibilities, achievements and work..."
                                        className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Technologies
                                    </label>

                                    <div className="flex gap-2">
                                        <input
                                            value={technologyInput}
                                            onChange={(event) =>
                                                setTechnologyInput(
                                                    event.target.value
                                                )
                                            }
                                            onKeyDown={
                                                handleTechnologyKeyDown
                                            }
                                            placeholder="React.js"
                                            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                        />

                                        <button
                                            type="button"
                                            onClick={addTechnology}
                                            className="rounded-lg border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {form.technologies.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {form.technologies.map(
                                                (technology) => (
                                                    <span
                                                        key={technology}
                                                        className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                                                    >
                                                        {technology}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeTechnology(
                                                                    technology
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
                                            ? "Update Experience"
                                            : "Create Experience"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Experience list */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Professional Experience
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {experiences.length} experience
                            {experiences.length === 1 ? "" : "s"} available.
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-500">
                            Loading experience...
                        </div>
                    ) : experiences.length === 0 ? (
                        <div className="p-12 text-center">
                            <BriefcaseBusiness
                                size={40}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                No experience yet
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Add your first professional experience.
                            </p>

                            <button
                                onClick={openCreateForm}
                                className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                Add Experience
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200">

                            {experiences.map((experience) => (
                                <div
                                    key={experience.id}
                                    className="p-6 hover:bg-slate-50"
                                >
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                                        <div className="flex gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                                <BriefcaseBusiness
                                                    size={21}
                                                    className="text-slate-700"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900">
                                                        {
                                                            experience.position
                                                        }
                                                    </h3>

                                                    {experience.is_current && (
                                                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                            Current
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-1 text-sm font-medium text-slate-700">
                                                    {
                                                        experience.company
                                                    }
                                                </p>

                                                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                                                    {experience.location && (
                                                        <span>
                                                            {
                                                                experience.location
                                                            }
                                                        </span>
                                                    )}

                                                    {experience.employment_type && (
                                                        <span>
                                                            •
                                                            {
                                                                experience.employment_type
                                                            }
                                                        </span>
                                                    )}

                                                    <span className="flex items-center gap-1">
                                                        <CalendarDays
                                                            size={14}
                                                        />

                                                        {formatDate(
                                                            experience.start_date
                                                        )}

                                                        {" — "}

                                                        {experience.is_current
                                                            ? "Present"
                                                            : formatDate(
                                                                experience.end_date
                                                            )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    openEditForm(
                                                        experience
                                                    )
                                                }
                                                className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100"
                                            >
                                                <Pencil size={17} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        experience
                                                    )
                                                }
                                                className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>

                                    </div>

                                    {experience.description && (
                                        <p className="mt-5 max-w-4xl text-sm leading-6 text-slate-600">
                                            {
                                                experience.description
                                            }
                                        </p>
                                    )}

                                    {experience.technologies?.length >
                                        0 && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {experience.technologies.map(
                                                    (technology) => (
                                                        <span
                                                            key={
                                                                technology
                                                            }
                                                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                                                        >
                                                        {
                                                            technology
                                                        }
                                                    </span>
                                                    )
                                                )}
                                            </div>
                                        )}
                                </div>
                            ))}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Experience;