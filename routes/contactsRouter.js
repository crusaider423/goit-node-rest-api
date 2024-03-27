import express from "express";
import isValidBody from "../middlewares/isValidBody.js";
import isValidId from "../middlewares/isValidId.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", isValidBody(createContactSchema), createContact);

contactsRouter.put(
  "/:id",
  isValidId,
  isValidBody(updateContactSchema),
  updateContact
);
contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  isValidBody(updateContactSchema),
  updateStatusContact
);

export default contactsRouter;
