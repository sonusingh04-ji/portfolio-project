import {
    getAbout as getAboutModel,
    updateAbout as updateAboutModel,
} from "../models/aboutModel.js";

export const getAbout = async () => {
    return await getAboutModel();
};

export const updateAbout = async (data) => {
    return await updateAboutModel(data);
};