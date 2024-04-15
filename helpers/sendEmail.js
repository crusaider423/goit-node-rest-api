import nodemailer from "nodemailer";
import { UKR_NET_FROM, UKR_NET_PASSWORD } from "./env.js";

const nodemailerConfige = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_FROM,
    pass: UKR_NET_PASSWORD,
  },
};
const transport = nodemailer.createTransport(nodemailerConfige);
const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_FROM };
  return transport.sendMail(email);
};
export default sendEmail;
