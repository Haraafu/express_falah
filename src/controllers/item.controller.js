const itemRepository = require("../repositories/item.repository");
const storeRepository = require("../repositories/store.repository"); 
const baseResponse = require("../utils/baseResponse.util");
const uploadToCloudinary = require("../../upload"); 

exports.createItem = async (req, res) => {
  const { name, price, store_id, stock } = req.body;

  if (!name || !price || !store_id || !stock) {
    return baseResponse(res, false, 400, "Name, price, store_id, and stock are required", null);
  }

  try {
    const store = await storeRepository.getStoreById(store_id);
    if (!store) {
      return baseResponse(res, false, 400, "Store doesnt exist", null);
    }

    let image_url = req.body.image_url || "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file, "uploads");
      image_url = result.secure_url || result.url || "";
    }

    const newItem = await itemRepository.createItem(
      name,
      Number(price),
      store_id,
      image_url,
      Number(stock)
    );

    return baseResponse(res, true, 201, "Item created", newItem);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, "Server Error", null);
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await itemRepository.getAllItems();
    return baseResponse(res, true, 200, "Items found", items);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, "Error retrieving items", null);
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await itemRepository.getItemById(req.params.id);
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    return baseResponse(res, true, 200, "Item found", item);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, "Error retrieving item", null);
  }
};

exports.getItemsByStoreId = async (req, res) => {
  const { store_id } = req.params;
  try {
    const store = await storeRepository.getStoreById(store_id);
    if (!store) {
      return baseResponse(res, false, 400, "Store doesnt exist", null);
    }

    const items = await itemRepository.getItemsByStoreId(store_id);
    return baseResponse(res, true, 200, "Items found", items);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, "Error retrieving items", null);
  }
};

exports.updateItem = async (req, res) => {
  const { id, name, price, store_id, stock } = req.body;

  if (!id || !name || !price || !store_id || !stock) {
    return baseResponse(
      res,
      false,
      400,
      "ID, name, price, store_id, and stock are required",
      null
    );
  }

  try {
    const store = await storeRepository.getStoreById(store_id);
    if (!store) {
      return baseResponse(res, false, 400, "Store doesnt exist", null);
    }

    let image_url = req.body.image_url || "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file, "uploads");
      image_url = result.secure_url || result.url || "";
    }

    const updatedItem = await itemRepository.updateItem(id, {
      name,
      price: Number(price),
      store_id,
      image_url,
      stock: Number(stock),
    });

    if (!updatedItem) {
      return baseResponse(res, false, 404, "Item not found", null);
    }

    return baseResponse(res, true, 200, "Item updated", updatedItem);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, "Error updating item", null);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await itemRepository.deleteItem(req.params.id);
    if (!deletedItem) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    return baseResponse(res, true, 200, "Item deleted", deletedItem);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, "Error deleting item", null);
  }
};
