import { useEffect, useState } from "react";
import { Save, UserRound } from "lucide-react";

import api from "../services/api";

const emptyForm = {
    fullName: "",
    headline: "",
    bio: "",
    profileImageUrl: "",
    resumeUrl: "",
    location: "",
    email: "",
    phone: "",
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: ""
};

const About = () => {
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadAbout = async () => {
            try {
                const response = await api.get("/api/about");

                const data = response.data.data;

                setForm({
                    fullName: data.full_name || "",
                    headline: data.headline || "",
                    bio: data.bio || "",
                    profileImageUrl: data.profile_image_url || "",
                    resumeUrl: data.resume_url || "",
                    location: data.location || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    githubUrl: data.github_url || "",
                    linkedinUrl: data.linkedin_url || "",
                    websiteUrl: data.website_url || ""
                });
            } catch (err) {
                if (err.response?.status !== 404) {
                    setError(
                        err.response?.data?.message ||
                        "Failed to load About information"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadAbout();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const response = await api.put(
                "/api/about",
                form
            );

            const data = response.data.data;

            setForm({
                fullName: data.full_name || "",
                headline: data.headline || "",
                bio: data.bio || "",
                profileImageUrl:
                    data.profile_image_url || "",
                resumeUrl: data.resume_url || "",
                location: data.location || "",
                email: data.email || "",
                phone: data.phone || "",
                githubUrl: data.github_url || "",
                linkedinUrl:
                    data.linkedin_url || "",
                websiteUrl:
                    data.website_url || ""
            });

            setSuccess(
                "About information updated successfully."
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update About information"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="rounded-2xl bg-white p-8">
                    Loading About information...
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mx-auto max-w-5xl">

                <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-slate-900 p-3 text-white">
                        <UserRound size={22} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            About
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your personal profile information.
                        </p>
                    </div>
                </div>

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

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6"
                >

                    <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Basic Information
                        </h2>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Full Name
                                </label>

                                <input
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Headline
                                </label>

                                <input
                                    name="headline"
                                    value={form.headline}
                                    onChange={handleChange}
                                    placeholder="Full Stack Developer"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                    required
                                />
                            </div>

                        </div>

                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-medium">
                                Bio
                            </label>

                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                rows={6}
                                className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                required
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Contact Information
                        </h2>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Location
                                </label>

                                <input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Phone
                                </label>

                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                />
                            </div>

                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Links & Files
                        </h2>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Profile Image URL
                                </label>

                                <input
                                    name="profileImageUrl"
                                    value={form.profileImageUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Resume URL
                                </label>

                                <input
                                    name="resumeUrl"
                                    value={form.resumeUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    GitHub URL
                                </label>

                                <input
                                    name="githubUrl"
                                    value={form.githubUrl}
                                    onChange={handleChange}
                                    placeholder="https://github.com/..."
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    LinkedIn URL
                                </label>

                                <input
                                    name="linkedinUrl"
                                    value={form.linkedinUrl}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/..."
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium">
                                    Website URL
                                </label>

                                <input
                                    name="websiteUrl"
                                    value={form.websiteUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                />
                            </div>

                        </div>
                    </section>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={18} />

                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default About;