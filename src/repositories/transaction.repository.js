const db = require("../database/pg.database");

exports.createTransaction = async (user_id, item_id, quantity, total) => {
  try {
    const res = await db.query(
      "INSERT INTO transactions (user_id, item_id, quantity, total, status) VALUES ($1, $2, $3, $4, 'pending') RETURNING *",
      [user_id, item_id, parseInt(quantity, 10), total]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.getTransactionById = async (id) => {
  try {
    const res = await db.query("SELECT * FROM transactions WHERE id = $1", [id]);
    return res.rows.length > 0 ? res.rows[0] : null;
  } catch (error) {
    throw error;
  }
};

exports.updateTransactionStatus = async (id, status) => {
  try {
    const res = await db.query(
      "UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.getAllTransactions = async () => {
  try {
    const res = await db.query(`
      SELECT 
        t.*,
        row_to_json(u) AS user,
        row_to_json(i) AS item
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      JOIN items i ON t.item_id = i.id
      ORDER BY t.created_at DESC
    `);
    return res.rows;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

exports.deleteTransaction = async (id) => {
  try {
    const res = await db.query("DELETE FROM transactions WHERE id = $1 RETURNING *", [id]);
    return res.rows.length > 0 ? res.rows[0] : null;
  } catch (error) {
    throw error;
  }
};
