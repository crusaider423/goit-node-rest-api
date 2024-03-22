import { nanoid } from "nanoid";
import * as helper from "../helpers/contactsServicesHelper.js";

export async function listContacts() {
  const data = await helper.getAllContacts();
  return data;
}

export async function getContactById(contactId) {
  const data = (await helper.getAllContacts()).find(({ id }) => id === contactId);
  return data || null;
}

export async function removeContact(contactId) {
  const contacts = await helper.getAllContacts();
  const index = contacts.findIndex(({ id }) => id === contactId);
  if (index === -1) {
    return null;
  }
  const [deletedContact] = contacts.splice(index, 1);
  await helper.updateContacts(contacts);
  return deletedContact;
}

export async function addContact({ name, email, phone }) {
  const contacts = await helper.getAllContacts();
  const dublicat = contacts.find(
    ({ email: existingEmail, phone: existingPhone }) =>
      existingEmail === email || existingPhone === phone
  );
  if (dublicat) return "this contact alredy exists";
  const contact = { name, email, phone, id: nanoid() };
  contacts.push(contact);
  await helper.updateContacts(contacts);
  return contact;
}

export const updateContact = async (contactId, data) => {
  const contacts = await helper.getAllContacts();
  const index = await contacts.findIndex(({ id }) => id === contactId);
  if (index === -1) return null;
  contacts[index] = { ...contacts[index], ...data };
  await helper.updateContacts(contacts);
  return contacts[index];
};
