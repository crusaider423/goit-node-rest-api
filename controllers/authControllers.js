import * as services from "../services/authServices.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { JWT_SECRET } from "../helpers/env.js";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const findUser = await services.findOne({ email });
    if (findUser) throw HttpError(409, "Email in use");
    const url = gravatar.url(email);
    const newUser = await services.register({
      email,
      password: hashPassword,
      avatarURL: url,
    });
    res.status(201).json({
      user: {
        email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const findUser = await services.findOne({ email });
    if (!findUser) throw HttpError(401, "Email or password is wrong");
    const comparePassword = await bcrypt.compare(password, findUser.password);
    if (!comparePassword) throw HttpError(401, "Email or password is wrong");
    const { _id: id } = findUser;
    const token = jwt.sign({ id }, JWT_SECRET);
    await services.update({ _id: id }, { token });
    res.json({
      token,
      user: {
        email,
        subscription: findUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await services.update({ _id }, { token: null });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
export const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};
export const updateSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;
    const chengeSubscription = await services.update({ _id }, { subscription });
    res.json({ subscription: chengeSubscription.subscription });
  } catch (error) {
    next(error);
  }
};
export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw HttpError(400, "file do not passed");
    const { _id } = req.user;
    const avatarsPath = path.resolve("public", "avatars");
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);
    const image = await Jimp.read(oldPath);
    image.resize(300, 300).writeAsync(newPath);
    await fs.unlink(oldPath);
    const avatarURL = path.join('avatars',filename)
    await services.update({ _id }, { avatarURL });
    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
