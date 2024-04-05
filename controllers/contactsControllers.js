import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, favorite } = req.query;
    const { _id: owner } = req.user;
    const skip = (page - 1) * limit;
    const filter = favorite !== undefined ? { owner, favorite } : { owner };
    const data = await contactsService.listContacts(filter, { skip, limit });
    const total = await contactsService.countContacts({ owner });
    const perpage = data.length;
    res.json({ data, total, perpage });
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contactsService.getContactById(id);
    if (!data) throw HttpError(404);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contactsService.removeContact(id);
    if (!data) throw HttpError(404);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const data = await contactsService.addContact({ ...req.body, owner });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const isBodyEmpty = Object.keys(req.body).length === 0;
    if (isBodyEmpty) throw HttpError(400, "Body must have at least one field");
    const { id } = req.params;
    const data = await contactsService.updateContact(id, req.body);
    if (!data) throw HttpError(404);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const updateFavorite = await contactsService.updateStatusContact(
      id,
      favorite
    );
    if (!updateFavorite) throw HttpError(404, "message not found");
    res.status(200).json(updateFavorite);
  } catch (error) {
    next(error);
  }
};
