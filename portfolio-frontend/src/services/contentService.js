import api from "./api";

export const getAbout = async () => {
    const response = await api.get("/api/about");
    return response.data;
};

export const getSkills = async () => {
    const response = await api.get("/api/skills");
    return response.data;
};

export const getProjects = async () => {
    const response = await api.get("/api/projects");
    return response.data;
};

export const getExperience = async () => {
    const response = await api.get("/api/experience");
    return response.data;
};

export const getServices = async () => {
    const response = await api.get("/api/services");
    return response.data;
};

export const getTestimonials = async () => {
    const response = await api.get("/api/testimonials");
    return response.data;
};
export const getBlogs = async () => {
    const response = await api.get("/api/blogs");
    return response.data;
};
export const submitContact = async (data) => {
    const response = await api.post(
        "/api/contact",
        data
    );

    return response.data;
};
