const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseResponse.util");
const bcrypt = require("bcrypt");

const emailRegex = /^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}$/;
const passwordRegex = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

exports.registerUser = async (req, res) => {
  const { email, password, name } = req.query;
  if (!email || !password || !name) {
    return baseResponse(res, false, 400, "Email, password, and name are required");
  }

  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }

  if (!passwordRegex.test(password)) {
    return baseResponse(res, false, 400, "Password must be at least 8 characters long and contain at least one number and one special character", null);
  }

  try {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return baseResponse(res, false, 400, "Email already used", null);
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.registerUser(name, email, hashedPassword);
    baseResponse(res, true, 200, "User created", newUser);
  } catch (error) {
    console.error(error);
    baseResponse(res, false, 500, "Server Error", error);
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.query;
  if (!email || !password) {
    return baseResponse(res, false, 400, "Email and password are required", null);
  }

  try {
    const user = await userRepository.loginUser(email);
    console.log(user);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return baseResponse(res, false, 400, "Invalid email or password", null);
    }

    baseResponse(res, true, 200, "Login success", user);
  } catch (error) {
    baseResponse(res, false, 500, "Server Error", error);
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await userRepository.getUserByEmail(req.params.email);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User found", user);
  } catch (error) {
    baseResponse(res, false, 500, "Server Error", error);
  }
};

exports.updateUser = async (req, res) => {
  const { id, email, password, name } = req.body;

  if (!id || !email || !name) {
    return baseResponse(res, false, 400, "ID, email, and name are required");
  }

  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }

  if (!passwordRegex.test(password)) {
    return baseResponse(res, false, 400, "Password must be at least 8 characters long and contain at least one number and one special character", null);
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await userRepository.updateUser(id, { email, hashedPassword, name });
      if (!updatedUser) {
        return baseResponse(res, false, 404, "User not found", null);
      }
      baseResponse(res, true, 200, "User updated", updatedUser);
    } catch (error) {
      baseResponse(res, false, 500, "Server Error", error);
    }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userRepository.deleteUser(req.params.id);
    if (!deletedUser) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    baseResponse(res, true, 200, "User deleted", deletedUser);
  } catch (error) {
    baseResponse(res, false, 500, "Server Error", error);
  }
};

exports.topUp = async (req, res) => {
  const { id, amount } = req.query;

  if (!id || !amount) {
    return baseResponse(res, false, 400, "User ID and amount are required", null);
  }

  const topUpAmount = parseInt(amount, 10);
  if (isNaN(topUpAmount) || topUpAmount <= 0) {
    return baseResponse(res, false, 400, "Amount must be larger than 0", null);
  }

  try {
    const user = await userRepository.topUpUser(id, topUpAmount); 

    if (!user) {
      console.log("User not found!");
      return baseResponse(res, false, 404, "User not found", null);
    }
    
    baseResponse(res, true, 200, "Top up successful", user);
  } catch (error) {
    baseResponse(res, false, 500, "Server Error", error);
  }
};

