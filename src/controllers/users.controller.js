import { usersService } from "../services/index.js";
import logger from "../config/logger.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAll();
    logger.info(`Users fetched: ${users.length}`);
    return res.send({ status: "success", payload: users });
  } catch (error) {
    logger.error("Error getting users:", error);
    return res.status(500).send({
      status: "error",
      error: "Internal server error",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);

    if (!user) {
      logger.warn(`User not found: ${userId}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }

    logger.info(`User fetched: ${userId}`);
    return res.send({ status: "success", payload: user });
  } catch (error) {
    logger.error("Error getting user:", error);
    return res.status(500).send({
      status: "error",
      error: "Internal server error",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;

    const user = await usersService.getUserById(userId);
    if (!user) {
      logger.warn(`User not found for update: ${userId}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }

    await usersService.update(userId, updateBody);
    logger.info(`User updated: ${userId}`);
    return res.send({ status: "success", message: "User updated" });
  } catch (error) {
    logger.error("Error updating user:", error);
    return res.status(500).send({
      status: "error",
      error: "Internal server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.uid;

    const deletedUser = await usersService.delete(userId);
    if (!deletedUser) {
      logger.warn(`User not found for deletion: ${userId}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }

    logger.info(`User deleted: ${userId}`);
    return res.send({ status: "success", message: "User deleted" });
  } catch (error) {
    logger.error("Error deleting user:", error);
    return res.status(500).send({
      status: "error",
      error: "Internal server error",
    });
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
};
