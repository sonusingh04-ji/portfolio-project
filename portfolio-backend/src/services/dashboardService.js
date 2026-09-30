import {
    getDashboardStats as getDashboardStatsModel
} from "../models/dashboardModel.js";

export const getDashboardStats = async () => {
    return await getDashboardStatsModel();
};