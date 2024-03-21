import fs from "fs/promises";
import path from "path";
const contactsPath = path.resolve("./db/contacts.json");

export const getAllContacts = async () =>
  JSON.parse(await fs.readFile(contactsPath));

export const updateContacts = async (contacts) =>
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

