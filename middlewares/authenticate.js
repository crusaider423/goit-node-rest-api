import jsw from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { JWT_SECRET } from "../helpers/env.js";
import { findOne } from "../services/authServices.js";
const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw HttpError(401, "Not authorized");
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer" || !token) throw HttpError(401, "Not authorized");
    const verifyToken = jsw.verify(token, JWT_SECRET);
    const findUser = await findOne({ _id: verifyToken.id });
    if (!findUser || !findUser.token) throw HttpError(401, "Not authorized ");
    req.user = findUser;
    next();
  } catch (error) {
    next(error);
  }
};
export default authenticate;
