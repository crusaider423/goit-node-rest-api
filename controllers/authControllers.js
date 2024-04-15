import * as services from "../services/authServices.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { JWT_SECRET, PROJECT_URL } from "../helpers/env.js";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import { randomUUID } from "crypto";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import sendEmail from "../helpers/sendEmail.js";

const register = async (req, res) => {
  const { email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const findUser = await services.findOne({ email });
  if (findUser) throw HttpError(409, "Email in use");
  const url = gravatar.url(email);
  const verificationToken = randomUUID();
  const newUser = await services.register({
    email,
    password: hashPassword,
    avatarURL: url,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target ="_blank" href="${PROJECT_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.status(201).json({
    user: {
      email,
      subscription: newUser.subscription,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  console.log(verificationToken);
  const user = await services.findOne({ verificationToken });
  if (!user) throw HttpError(404, "Email not found or already verified");
  await services.update(
    { _id: user._id },
    { verify: true, verificationToken: "" }
  );
  res.json({ message: "Verification successful" });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await services.findOne({ email });
  if (!user) throw HttpError(404, "email is not found");
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target ="_blank" href="${PROJECT_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await services.findOne({ email });
  if (!findUser) throw HttpError(401, "Email or password is wrong");
  if (!findUser.verify) throw HttpError(401, "Email not verify");
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
};

const logout = async (req, res) => {
  try {
    const { _id } = req.user;
    await services.update({ _id }, { token: null });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const current = async (req, res) => {
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

const updateSubscription = async (req, res) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;
    const chengeSubscription = await services.update({ _id }, { subscription });
    res.json({ subscription: chengeSubscription.subscription });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) throw HttpError(400, "file do not passed");
    const { _id } = req.user;
    const avatarsPath = path.resolve("public", "avatars");
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);
    const image = await Jimp.read(oldPath);
    image.resize(300, 300).writeAsync(newPath);
    await fs.unlink(oldPath);
    const avatarURL = `/avatars/${filename}`;
    await services.update({ _id }, { avatarURL });
    console.log(avatarURL);
    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

const controllers = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
export default controllers;
