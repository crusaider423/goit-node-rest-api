import Joi from "joi";
import { subscriptionList } from "../constants/user-constants.js";
export const authSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
export const updateSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});

export const emailSchema = Joi.object({
  email: Joi.string().required(),
});
