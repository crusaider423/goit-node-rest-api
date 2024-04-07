import Contact from "../models/Contact.js";

export const listContacts = (filter, settings) =>
  Contact.find(filter, null, settings).populate("owner", "email subscription");

export const getContactById = (filter) => Contact.find(filter);

export const removeContact = (filter) => Contact.find(filter);

export const addContact = (data) => Contact.create(data);

export const updateContact = (filter, data) => Contact.findOneAndUpdate(filter, data);

export const countContacts = (filter) => Contact.countDocuments(filter);

export const updateStatusContact = (filter, favorite) =>
  Contact.findOneAndUpdate(filter, { favorite });
