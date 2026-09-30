import { useEffect, useMemo, useState } from "react";

import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    BriefcaseBusiness,
    Code2,
    Mail,
    MapPin,
    MessageCircle,
    Quote,
    ServerCog,
    Sparkles,
    UserRound
} from "lucide-react";

import { Link } from "react-router-dom";

import {
    getAbout,
    getSkills,
    getProjects,
    getExperience,
    getServices,
    getTestimonials,
    getBlogs
} from "../services/contentService";

const Home = () => {
    const [about, setAbout] = useState(null);
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [experience, setExperience] = useState([]);
    const [services, setServices] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [blogs, setBlogs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("home");

    /*
     * Side navigation sections.
     * These IDs correspond to the sections below.
     */
    const sideLinks = [
        {
            id: "home",
            label: "Home"
        },
        {
            id: "about",
            label: "About"
        },
        {
            id: "skills",
            label: "Skills"
        },
        {
            id: "projects",
            label: "Projects"
        },
        {
            id: "experience",
            label: "Experience"
        },
        {
            id: "services",
            label: "Services"
        },
        {
            id: "testimonials",
            label: "Testimonials"
        },
        {
            id: "blog",
            label: "Blog"
        },
        {
            id: "contact",
            label: "Contact"
        }
    ];

    /*
     * Smooth scrolling.
     */
    const scrollToSection = (id) => {
        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    /*
     * Load all public CMS content.
     */
    useEffect(() => {
        const loadHomeData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    aboutResponse,
                    skillsResponse,
                    projectsResponse,
                    experienceResponse,
                    servicesResponse,
                    testimonialsResponse,
                    blogsResponse
                ] = await Promise.all([
                    getAbout(),
                    getSkills(),
                    getProjects(),
                    getExperience(),
                    getServices(),
                    getTestimonials(),
                    getBlogs()
                ]);

                /*
                 * ABOUT
                 */
                setAbout(
                    aboutResponse?.data || null
                );

                /*
                 * SKILLS
                 */
                const visibleSkills = (
                    skillsResponse?.data || []
                )
                    .filter(
                        (skill) =>
                            skill.is_visible === true
                    )
                    .sort(
                        (a, b) =>
                            (a.display_order ?? 0) -
                            (b.display_order ?? 0)
                    );

                setSkills(visibleSkills);

                /*
                 * PROJECTS
                 */
                const publishedProjects = (
                    projectsResponse?.data || []
                )
                    .filter(
                        (project) =>
                            project.is_published !== false
                    )
                    .sort(
                        (a, b) =>
                            (a.display_order ?? 0) -
                            (b.display_order ?? 0)
                    );

                setProjects(publishedProjects);

                /*
                 * EXPERIENCE
                 */
                const sortedExperience = (
                    experienceResponse?.data || []
                ).sort(
                    (a, b) =>
                        (a.display_order ?? 0) -
                        (b.display_order ?? 0)
                );

                setExperience(sortedExperience);

                /*
                 * SERVICES
                 */
                const visibleServices = (
                    servicesResponse?.data || []
                )
                    .filter(
                        (service) =>
                            service.is_visible === true
                    )
                    .sort(
                        (a, b) =>
                            (a.display_order ?? 0) -
                            (b.display_order ?? 0)
                    );

                setServices(visibleServices);

                /*
                 * TESTIMONIALS
                 *
                 * Your API currently returns 0 records,
                 * so this safely remains an empty array.
                 */
                setTestimonials(
                    testimonialsResponse?.data || []
                );

                /*
                 * BLOGS
                 */
                const publishedBlogs = (
                    blogsResponse?.data || []
                )
                    .filter(
                        (blog) =>
                            blog.status === "PUBLISHED"
                    )
                    .sort((a, b) => {
                        const dateA = new Date(
                            a.published_at ||
                            a.created_at ||
                            0
                        ).getTime();

                        const dateB = new Date(
                            b.published_at ||
                            b.created_at ||
                            0
                        ).getTime();

                        return dateB - dateA;
                    });

                setBlogs(publishedBlogs);

            } catch (err) {
                console.error(
                    "Home data load error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load portfolio content."
                );
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    /*
     * Highlight the section currently visible.
     */
    useEffect(() => {
        const sections = sideLinks
            .map((item) =>
                document.getElementById(item.id)
            )
            .filter(Boolean);

        if (!sections.length) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            b.intersectionRatio -
                            a.intersectionRatio
                    );

                if (visibleEntries.length > 0) {
                    setActiveSection(
                        visibleEntries[0].target.id
                    );
                }
            },
            {
                threshold: [0.2, 0.4, 0.6],
                rootMargin: "-15% 0px -45% 0px"
            }
        );

        sections.forEach((section) =>
            observer.observe(section)
        );

        return () => {
            observer.disconnect();
        };
    }, [loading]);

    /*
     * Featured projects.
     */
    const featuredProjects = useMemo(() => {
        const featured = projects.filter(
            (project) => project.featured === true
        );

        if (featured.length > 0) {
            return featured.slice(0, 2);
        }

        return projects.slice(0, 2);
    }, [projects]);

    /*
     * Home skill preview.
     */
    const previewSkills = skills.slice(0, 4);

    /*
     * Home experience preview.
     */
    const previewExperience =
        experience.slice(0, 2);

    /*
     * Home services preview.
     */
    const previewServices =
        services.slice(0, 3);

    /*
     * Home blog preview.
     */
    const previewBlogs =
        blogs.slice(0, 2);

    const formatDate = (value) => {
        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    return (
        <main className="bg-white text-slate-950">

            {/* =====================================================
                SIDE SECTION NAVIGATION
            ====================================================== */}

            <nav
                aria-label="Page sections"
                className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 xl:block"
            >
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-xl backdrop-blur">

                    <div className="flex flex-col gap-1">

                        {sideLinks.map((item) => {
                            const active =
                                activeSection === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() =>
                                        scrollToSection(
                                            item.id
                                        )
                                    }
                                    title={item.label}
                                    aria-label={`Go to ${item.label}`}
                                    className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium transition ${
                                        active
                                            ? "bg-slate-950 text-white"
                                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                                    }`}
                                >

                                    <span
                                        className={`h-2.5 w-2.5 rounded-full transition ${
                                            active
                                                ? "bg-white"
                                                : "bg-slate-300 group-hover:bg-slate-950"
                                        }`}
                                    />

                                    <span>
                                        {item.label}
                                    </span>

                                </button>
                            );
                        })}

                    </div>

                </div>
            </nav>

            {/* =====================================================
                HOME
            ====================================================== */}

            <section
                id="home"
                className="scroll-mt-24"
            >
                <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

                    <div className="absolute inset-0">

                        <div className="absolute left-[5%] top-[15%] h-72 w-72 rounded-full bg-white/[0.04] blur-3xl" />

                        <div className="absolute right-[5%] top-[30%] h-96 w-96 rounded-full bg-slate-500/[0.08] blur-3xl" />

                    </div>

                    <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-24 pt-36 lg:px-8 xl:pr-32">

                        <div className="grid w-full items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">

                            <div>

                                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">

                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                                    Available for opportunities

                                </div>

                                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
                                    {about?.headline ||
                                        "Full Stack Developer"}
                                </p>

                                <h1 className="mt-5 max-w-5xl text-5xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">

                                    {about?.full_name ? (
                                        <>
                                            Hi, I'm{" "}
                                            {about.full_name}.
                                            <br />

                                            <span className="text-slate-400">
                                                I build digital
                                                products.
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Building digital
                                            <br />
                                            experiences that
                                            <br />

                                            <span className="text-slate-400">
                                                solve real problems.
                                            </span>
                                        </>
                                    )}

                                </h1>

                                <p className="mt-8 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                                    {about?.bio ||
                                        "I build modern web applications with clean interfaces, reliable backend systems and scalable APIs."}
                                </p>

                                <div className="mt-10 flex flex-wrap gap-4">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            scrollToSection(
                                                "projects"
                                            )
                                        }
                                        className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-slate-200"
                                    >
                                        View Projects

                                        <ArrowUpRight
                                            size={18}
                                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            scrollToSection(
                                                "contact"
                                            )
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 font-semibold text-white transition hover:bg-white/[0.06]"
                                    >
                                        Let's Talk

                                        <ArrowUpRight
                                            size={18}
                                        />
                                    </button>

                                </div>

                                {previewSkills.length > 0 && (
                                    <div className="mt-12 flex flex-wrap gap-3">

                                        {previewSkills.map(
                                            (skill) => (
                                                <span
                                                    key={
                                                        skill.id
                                                    }
                                                    className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400"
                                                >
                                                    {skill.name}
                                                </span>
                                            )
                                        )}

                                    </div>
                                )}

                            </div>

                            <div className="hidden lg:block">

                                <div className="relative mx-auto max-w-md">

                                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">

                                        <div className="rounded-3xl border border-white/10 bg-slate-900 p-7">

                                            <div className="flex items-center justify-between">

                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                                        Developer
                                                    </p>

                                                    <p className="mt-2 text-xl font-semibold">
                                                        Portfolio System
                                                    </p>
                                                </div>

                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-950">
                                                    <Code2
                                                        size={24}
                                                    />
                                                </div>

                                            </div>

                                            <div className="mt-8 space-y-3">

                                                <div className="rounded-xl bg-white/[0.05] p-4">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span className="text-sm text-slate-400">
                                                            Skills
                                                        </span>

                                                        <span className="text-sm font-semibold">
                                                            {
                                                                skills.length
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="rounded-xl bg-white/[0.05] p-4">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span className="text-sm text-slate-400">
                                                            Projects
                                                        </span>

                                                        <span className="text-sm font-semibold">
                                                            {
                                                                projects.length
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="rounded-xl bg-white/[0.05] p-4">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span className="text-sm text-slate-400">
                                                            Experience
                                                        </span>

                                                        <span className="text-sm font-semibold">
                                                            {
                                                                experience.length
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="rounded-xl bg-white/[0.05] p-4">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span className="text-sm text-slate-400">
                                                            Location
                                                        </span>

                                                        <span className="text-sm font-semibold">
                                                            {about?.location ||
                                                                "India"}
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </div>

                                    <div className="absolute -bottom-5 -left-8 hidden rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 shadow-xl xl:block">

                                        <div className="flex items-center gap-3">

                                            <Sparkles
                                                size={18}
                                            />

                                            <div>
                                                <p className="text-xs text-slate-500">
                                                    Focus
                                                </p>

                                                <p className="text-sm font-medium">
                                                    Full Stack Development
                                                </p>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* GLOBAL API STATUS */}

            {(loading || error) && (
                <section className="border-b border-slate-200 bg-slate-50 px-6 py-5 lg:px-8">

                    <div className="mx-auto max-w-7xl xl:pr-32">

                        {loading && (
                            <p className="text-sm text-slate-500">
                                Loading portfolio content...
                            </p>
                        )}

                        {!loading && error && (
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        )}

                    </div>

                </section>
            )}

            {/* =====================================================
                ABOUT
            ====================================================== */}

            <section
                id="about"
                className="scroll-mt-24 border-b border-slate-200 bg-white"
            >
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 xl:pr-32">

                    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                                About
                            </p>

                            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                                {about?.headline ||
                                    "Turning ideas into working products."}
                            </h2>

                            {about?.location && (
                                <div className="mt-6 inline-flex items-center gap-2 text-sm text-slate-500">
                                    <MapPin size={16} />
                                    {about.location}
                                </div>
                            )}

                        </div>

                        <div>

                            <p className="text-lg leading-8 text-slate-600">
                                {about?.bio ||
                                    "Learn more about my background, technical interests and development journey."}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection(
                                        "contact"
                                    )
                                }
                                className="mt-6 inline-flex items-center gap-2 font-semibold"
                            >
                                Let's connect
                                <ArrowRight
                                    size={17}
                                />
                            </button>

                        </div>

                    </div>

                </div>
            </section>

            {/* =====================================================
                SKILLS
            ====================================================== */}

            <section
                id="skills"
                className="scroll-mt-24 bg-slate-50"
            >
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 xl:pr-32">

                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                                Skills
                            </p>

                            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                                Tools I build with.
                            </h2>

                        </div>

                        <Link
                            to="/skills"
                            className="inline-flex items-center gap-2 font-semibold"
                        >
                            View all skills
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                    <div className="mt-12">

                        {previewSkills.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">
                                Skills published through the CMS will appear here.
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                                {previewSkills.map(
                                    (skill) => (
                                        <div
                                            key={
                                                skill.id
                                            }
                                            className="rounded-2xl border border-slate-200 bg-white p-6"
                                        >

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                                                <Code2
                                                    size={20}
                                                />
                                            </div>

                                            <h3 className="mt-5 text-lg font-semibold">
                                                {skill.name}
                                            </h3>

                                            <p className="mt-2 text-sm text-slate-500">
                                                {
                                                    skill.category
                                                }
                                            </p>

                                            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">

                                                <div
                                                    className="h-full rounded-full bg-slate-950"
                                                    style={{
                                                        width: `${Math.max(
                                                            0,
                                                            Math.min(
                                                                100,
                                                                Number(
                                                                    skill.proficiency
                                                                ) || 0
                                                            )
                                                        )}%`
                                                    }}
                                                />

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                </div>
            </section>

            {/* =====================================================
                PROJECTS
            ====================================================== */}

            <section
                id="projects"
                className="scroll-mt-24 bg-white"
            >
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 xl:pr-32">

                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                                Selected Work
                            </p>

                            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                                Featured projects.
                            </h2>

                        </div>

                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 font-semibold"
                        >
                            See all projects
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                    <div className="mt-12">

                        {featuredProjects.length === 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white text-slate-300">
                                    <BriefcaseBusiness
                                        size={24}
                                    />
                                </div>

                                <h3 className="mt-5 text-xl font-bold">
                                    Projects coming soon
                                </h3>

                                <p className="mt-2 text-slate-500">
                                    Published projects from the CMS will appear here.
                                </p>

                            </div>
                        ) : (
                            <div className="grid gap-6 lg:grid-cols-2">

                                {featuredProjects.map(
                                    (project) => (
                                        <article
                                            key={
                                                project.id
                                            }
                                            className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition hover:-translate-y-1 hover:shadow-xl"
                                        >

                                            <div className="aspect-[16/9] bg-slate-950">

                                                {project.image_url ? (
                                                    <img
                                                        src={
                                                            project.image_url
                                                        }
                                                        alt={
                                                            project.title
                                                        }
                                                        loading="lazy"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-white">

                                                        <div className="text-center">

                                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white text-slate-950">
                                                                <BriefcaseBusiness
                                                                    size={24}
                                                                />
                                                            </div>

                                                            <p className="mt-4 text-sm font-medium text-slate-400">
                                                                {
                                                                    project.title
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>
                                                )}

                                            </div>

                                            <div className="p-8">

                                                {project.featured && (
                                                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                                                        <Sparkles
                                                            size={14}
                                                        />
                                                        Featured
                                                    </span>
                                                )}

                                                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                                    {
                                                        project.slug
                                                    }
                                                </p>

                                                <h3 className="mt-3 text-2xl font-bold">
                                                    {
                                                        project.title
                                                    }
                                                </h3>

                                                <p className="mt-4 leading-7 text-slate-600">
                                                    {
                                                        project.description
                                                    }
                                                </p>

                                                {Array.isArray(
                                                        project.tech_stack
                                                    ) &&
                                                    project.tech_stack.length >
                                                    0 && (
                                                        <div className="mt-6 flex flex-wrap gap-2">

                                                            {project.tech_stack
                                                                .slice(
                                                                    0,
                                                                    6
                                                                )
                                                                .map(
                                                                    (
                                                                        technology
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                technology
                                                                            }
                                                                            className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                                                                        >
                                                                            {
                                                                                technology
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}

                                                        </div>
                                                    )}

                                                <Link
                                                    to="/projects"
                                                    className="mt-7 inline-flex items-center gap-2 font-semibold"
                                                >
                                                    Explore project
                                                    <ArrowUpRight
                                                        size={17}
                                                    />
                                                </Link>

                                            </div>

                                        </article>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                </div>
            </section>

            {/* =====================================================
                EXPERIENCE
            ====================================================== */}

            <section
                id="experience"
                className="scroll-mt-24 bg-slate-950 text-white"
            >
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 xl:pr-32">

                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                                Experience
                            </p>

                            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                                Experience that keeps evolving.
                            </h2>

                        </div>

                        <Link
                            to="/experience"
                            className="inline-flex items-center gap-2 font-semibold text-white"
                        >
                            View full experience
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                    <div className="mt-12">

                        {previewExperience.length === 0 ? (
                            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-slate-400">
                                Experience will appear here once published through the CMS.
                            </div>
                        ) : (
                            <div className="grid gap-5 lg:grid-cols-2">

                                {previewExperience.map(
                                    (item) => (
                                        <article
                                            key={item.id}
                                            className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"
                                        >

                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                                {
                                                    item.employment_type
                                                }
                                            </p>

                                            <h3 className="mt-3 text-2xl font-bold">
                                                {
                                                    item.position
                                                }
                                            </h3>

                                            <p className="mt-1 text-lg text-slate-300">
                                                {
                                                    item.company
                                                }
                                            </p>

                                            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">

                                                <span>
                                                    {formatDate(
                                                        item.start_date
                                                    )}
                                                    {" — "}
                                                    {item.is_current
                                                        ? "Present"
                                                        : formatDate(
                                                            item.end_date
                                                        )}
                                                </span>

                                                {item.location && (
                                                    <span className="inline-flex items-center gap-2">
                                                        <MapPin
                                                            size={
                                                                14
                                                            }
                                                        />
                                                        {
                                                            item.location
                                                        }
                                                    </span>
                                                )}

                                            </div>

                                            {item.description && (
                                                <p className="mt-5 leading-7 text-slate-400">
                                                    {
                                                        item.description
                                                    }
                                                </p>
                                            )}

                                            {Array.isArray(
                                                    item.technologies
                                                ) &&
                                                item.technologies
                                                    .length >
                                                0 && (
                                                    <div className="mt-6 flex flex-wrap gap-2">

                                                        {item.technologies.map(
                                                            (
                                                                technology
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        technology
                                                                    }
                                                                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400"
                                                                >
                                                                    {
                                                                        technology
                                                                    }
                                                                </span>
                                                            )
                                                        )}

                                                    </div>
                                                )}

                                        </article>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                </div>
            </section>

            {/* =====================================================
                SERVICES
            ====================================================== */}

            <section
                id="services"
                className="scroll-mt-24 bg-white"
            >
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 xl:pr-32">

                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                                Services
                            </p>

                            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                                From idea to working software.
                            </h2>

                        </div>

                        <Link
                            to="/services"
                            className="inline-flex items-center gap-2 font-semibold"
                        >
                            View services
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                    <div className="mt-12">

                        {previewServices.length === 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-slate-500">
                                Services published through the CMS will appear here.
                            </div>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-3">

                                {previewServices.map(
                                    (service) => (
                                        <article
                                            key={
                                                service.id
                                            }
                                            className="group rounded-3xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:shadow-xl"
                                        >

                                            <div className="flex items-center justify-between">

                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white">
                                                    {service.icon ===
                                                    "server" ? (
                                                        <ServerCog
                                                            size={
                                                                21
                                                            }
                                                        />
                                                    ) : (
                                                        <Code2
                                                            size={
                                                                21
                                                            }
                                                        />
                                                    )}
                                                </div>

                                                <ArrowUpRight
                                                    size={18}
                                                    className="text-slate-300 transition group-hover:text-slate-950"
                                                />

                                            </div>

                                            <h3 className="mt-6 text-xl font-bold">
                                                {
                                                    service.title
                                                }
                                            </h3>

                                            <p className="mt-4 leading-7 text-slate-600">
                                                {
                                                    service.description
                                                }
                                            </p>

                                        </article>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                </div>
            </section>

            {/* =====================================================
                TESTIMONIALS
            ====================================================== */}

            <section
                id="testimonials"
                className="scroll-mt-24 bg-slate-50"
            >
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 xl:pr-32">

                    <div className="text-center">

                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                            Testimonials
                        </p>

                        <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                            What people say.
                        </h2>

                    </div>

                    <div className="mt-12">

                        {testimonials.length === 0 ? (
                            <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-12 text-center">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                                    <Quote
                                        size={30}
                                    />
                                </div>

                                <h3 className="mt-6 text-2xl font-bold">
                                    Testimonials coming soon
                                </h3>

                                <p className="mt-3 leading-7 text-slate-500">
                                    Testimonials published through the CMS will appear here.
                                </p>

                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">

                                {testimonials
                                    .slice(0, 4)
                                    .map(
                                        (
                                            testimonial
                                        ) => (
                                            <article
                                                key={
                                                    testimonial.id
                                                }
                                                className="rounded-3xl border border-slate-200 bg-white p-8"
                                            >

                                                <MessageCircle
                                                    size={
                                                        24
                                                    }
                                                    className="text-slate-300"
                                                />

                                                <p className="mt-6 leading-8 text-slate-600">
                                                    {
                                                        testimonial.message
                                                    }
                                                </p>

                                                <div className="mt-7 border-t border-slate-100 pt-6">

                                                    <p className="font-semibold">
                                                        {
                                                            testimonial.name
                                                        }
                                                    </p>

                                                    {testimonial.company && (
                                                        <p className="mt-1 text-sm text-slate-500">
                                                            {
                                                                testimonial.company
                                                            }
                                                        </p>
                                                    )}

                                                </div>

                                            </article>
                                        )
                                    )}

                            </div>
                        )}

                    </div>

                </div>
            </section>

            {/* =====================================================
                BLOG
            ====================================================== */}

            <section
                id="blog"
                className="scroll-mt-24 bg-white"
            >
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 xl:pr-32">

                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                                Journal
                            </p>

                            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                                Latest from the blog.
                            </h2>

                        </div>

                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 font-semibold"
                        >
                            View blog
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                    <div className="mt-12">

                        {previewBlogs.length === 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white text-slate-300">
                                    <BookOpen
                                        size={26}
                                    />
                                </div>

                                <h3 className="mt-5 text-xl font-bold">
                                    Blog posts coming soon
                                </h3>

                                <p className="mt-2 text-slate-500">
                                    Published articles from the CMS will appear here.
                                </p>

                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">

                                {previewBlogs.map(
                                    (blog) => (
                                        <article
                                            key={
                                                blog.id
                                            }
                                            className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
                                        >

                                            <div className="aspect-[16/9] bg-slate-950">

                                                {blog.cover_image_url ? (
                                                    <img
                                                        src={
                                                            blog.cover_image_url
                                                        }
                                                        alt={
                                                            blog.title
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-white">

                                                        <BookOpen
                                                            size={
                                                                36
                                                            }
                                                        />

                                                    </div>
                                                )}

                                            </div>

                                            <div className="p-7">

                                                {blog.published_at && (
                                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                        {formatDate(
                                                            blog.published_at
                                                        )}
                                                    </p>
                                                )}

                                                <h3 className="mt-3 text-2xl font-bold">
                                                    {
                                                        blog.title
                                                    }
                                                </h3>

                                                <p className="mt-4 leading-7 text-slate-600">
                                                    {
                                                        blog.excerpt
                                                    }
                                                </p>

                                                <Link
                                                    to={`/blog/${blog.slug}`}
                                                    className="mt-6 inline-flex items-center gap-2 font-semibold"
                                                >
                                                    Read article
                                                    <ArrowUpRight
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </Link>

                                            </div>

                                        </article>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                </div>
            </section>

            {/* =====================================================
                CONTACT
            ====================================================== */}

            <section
                id="contact"
                className="scroll-mt-24 bg-slate-950 text-white"
            >
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 xl:pr-32">

                    <div className="grid gap-12 lg:grid-cols-[1fr_0.7fr]">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                                Contact
                            </p>

                            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
                                Have an idea?
                                <br />
                                Let's build it.
                            </h2>

                            <p className="mt-7 max-w-2xl leading-8 text-slate-400">
                                Have a project, collaboration or opportunity in mind? Send me a message through the contact page.
                            </p>

                            <Link
                                to="/contact"
                                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-slate-200"
                            >
                                Start a conversation
                                <ArrowUpRight
                                    size={18}
                                />
                            </Link>

                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-950">
                                <Mail size={22} />
                            </div>

                            <h3 className="mt-6 text-xl font-bold">
                                Contact details
                            </h3>

                            {about?.email && (
                                <a
                                    href={`mailto:${about.email}`}
                                    className="mt-5 block break-all text-slate-300 hover:text-white"
                                >
                                    {about.email}
                                </a>
                            )}

                            {about?.phone && (
                                <a
                                    href={`tel:${about.phone}`}
                                    className="mt-3 block text-slate-300 hover:text-white"
                                >
                                    {about.phone}
                                </a>
                            )}

                            {about?.location && (
                                <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                                    <MapPin
                                        size={15}
                                    />
                                    {about.location}
                                </div>
                            )}

                        </div>

                    </div>

                </div>
            </section>

        </main>
    );
};

export default Home;