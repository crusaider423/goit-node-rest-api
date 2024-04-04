import Contact from "../models/Contact.js";

export const listContacts = (filter, settings) =>
  Contact.find(filter, null, settings).populate("owner", "email subscription");

export const getContactById = (id) => Contact.findById(id);

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const addContact = (data) => Contact.create(data);

export const updateContact = (id, data) => Contact.findByIdAndUpdate(id, data);

export const countContacts = (filter) => Contact.countDocuments(filter);

export const updateStatusContact = (id, favorite) =>
  Contact.findByIdAndUpdate(id, { favorite });
