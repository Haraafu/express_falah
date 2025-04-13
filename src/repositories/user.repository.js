const db = require("../database/pg.database");

exports.registerUser = async (name, email, password) => {
    console.log(name)
  try {
    const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (checkUser.rows.length > 0) {
      return null;
    }
    
    const res = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

exports.loginUser = async (email) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

exports.getUserById = async (id) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

exports.updateUser = async (id, updatedData) => {
  try {
    const res = await db.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [updatedData.name, updatedData.email, updatedData.hashedPassword, id]
    );

    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

exports.deleteUser = async (id) => {
  try {
    const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

exports.topUpUser = async (id, amount) => {
  try {
    const res = await db.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *",
      [amount, id]
    );

    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

exports.updateBalance = async (id, newBalance) => {
  try {
    const res = await db.query(
      "UPDATE users SET balance = $1 WHERE id = $2 RETURNING *",
      [newBalance, id]
    );

    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}