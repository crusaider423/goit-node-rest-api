import User from "../models/User.js";

export const register = (data) => User.create(data);
export const findOne = (filter) => User.findOne(filter);
export const update = (filter, data) => User.findByIdAndUpdate(filter, data);
