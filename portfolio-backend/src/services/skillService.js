import {
    getAllSkills as getAllSkillsModel,
    createSkill as createSkillModel,
    updateSkill as updateSkillModel,
    deleteSkill as deleteSkillModel,
} from "../models/skillModel.js";

export const getAllSkills = async () => {
    return await getAllSkillsModel();
};

export const createSkill = async (data) => {
    return await createSkillModel(data);
};

export const updateSkill = async (id, data) => {
    return await updateSkillModel(id, data);
};

export const deleteSkill = async (id) => {
    return await deleteSkillModel(id);
};