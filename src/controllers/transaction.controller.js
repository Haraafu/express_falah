const transactionRepository = require("../repositories/transaction.repository");
const userRepository = require("../repositories/user.repository");
const itemRepository = require("../repositories/item.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.createTransaction = async (req, res) => {
  const { item_id, quantity, user_id } = req.body;

  const parsedQuantity = parseInt(quantity, 10);

  if (!item_id || !quantity || !user_id) {
    return baseResponse(res, false, 400, "Item ID, quantity, and user ID are required", null);
  }

  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    return baseResponse(res, false, 400, "Quantity must be larger than 0", null);
  }

  try {
    const item = await itemRepository.getItemById(item_id);
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }

    if (item.stock < parsedQuantity) {
      return baseResponse(res, false, 400, "Not enough stock available", null);
    }

    const user = await userRepository.getUserById(user_id);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    const total = item.price * parsedQuantity;
    const transaction = await transactionRepository.createTransaction(user_id, item_id, parsedQuantity, total);

    baseResponse(res, true, 201, "Transaction created", transaction);
  } catch (error) {
    baseResponse(res, false, 500, "Server Error", error);
  }
};

exports.payTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await transactionRepository.getTransactionById(id);
    if (!transaction) {
      return baseResponse(res, false, 404, "Transaction not found", null);
    }

    if (transaction.status === "paid") {
      return baseResponse(res, false, 400, "Transaction already paid", null);
    }

    const user = await userRepository.getUserById(transaction.user_id);
    if (!user || user.balance < transaction.total) {
      return baseResponse(res, false, 400, "Insufficient balance", null);
    }

    const item = await itemRepository.getItemById(transaction.item_id);
    if (!item || item.stock < transaction.quantity) {
      return baseResponse(res, false, 400, "Not enough stock", null);
    }

    await userRepository.updateBalance(transaction.user_id, user.balance - transaction.total);
    await itemRepository.updateStock(transaction.item_id, item.stock - transaction.quantity);
    const updatedTransaction = await transactionRepository.updateTransactionStatus(id, "paid");

    baseResponse(res, true, 200, "Payment successful", updatedTransaction);
  } catch (error) {
    baseResponse(res, false, 500, "Server Error", error);
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionRepository.getAllTransactions();
    baseResponse(res, true, 200, "Transactions found", transactions);
  } catch (error) {
    console.error("Server Error", error);
    baseResponse(res, false, 500, "Server Error", error);
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await transactionRepository.getTransactionById(id);
    if (!transaction) {
      return baseResponse(res, false, 404, "Transaction not found", null);
    }

    await transactionRepository.deleteTransaction(id);
    baseResponse(res, true, 200, "Transaction deleted", transaction);
  } catch (error) {
    baseResponse(res, false, 500, "Server Error", error);
  }
};
