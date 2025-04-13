const db = require("../database/pg.database");

exports.createItem = async (name, price, store_id, image_url, stock) => {
  const query = `
    INSERT INTO items (id, name, price, store_id, image_url, stock, created_at)
    VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, NOW())
    RETURNING *
  `;
  const values = [name, price, store_id, image_url, stock];
  const result = await db.query(query, values);
  return result.rows[0];
};

exports.getAllItems = async () => {
  const result = await db.query("SELECT * FROM items ORDER BY created_at DESC");
  return result.rows;
};

exports.getItemById = async (id) => {
  const result = await db.query("SELECT * FROM items WHERE id = $1", [id]);
  return result.rows[0] || null;
};

exports.getItemsByStoreId = async (store_id) => {
  const result = await db.query(
    "SELECT * FROM items WHERE store_id = $1 ORDER BY created_at DESC",
    [store_id]
  );
  return result.rows;
};

exports.updateItem = async (id, updatedData) => {
  const query = `
    UPDATE items
    SET name = $1, price = $2, store_id = $3, image_url = $4, stock = $5
    WHERE id = $6
    RETURNING *
  `;
  const values = [
    updatedData.name,
    updatedData.price,
    updatedData.store_id,
    updatedData.image_url,
    updatedData.stock,
    id,
  ];
  const result = await db.query(query, values);
  return result.rows[0] || null;
};

exports.deleteItem = async (id) => {
  const result = await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
};

exports.updateStock = async (id, stock) => {
  const query = `
    UPDATE items
    SET stock = $1
    WHERE id = $2
    RETURNING *
  `;
  const values = [stock, id];
  const result = await db.query(query, values);
  return result.rows[0] || null;
};