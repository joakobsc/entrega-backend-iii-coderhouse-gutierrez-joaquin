import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import logger from "../config/logger.js";

const getAllPets = async (req, res) => {
  try {
    const pets = await petsService.getAll();
    res.send({ status: "success", payload: pets });
  } catch (error) {
    logger.error("Error getting pets:", error);
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const createPet = async (req, res) => {
  try {
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate) {
      logger.warn("Incomplete values in createPet request");
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }

    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    const result = await petsService.create(pet);

    logger.info(`New pet created: ${result._id}`);
    res.send({ status: "success", payload: result });
  } catch (error) {
    logger.error("Error creating pet:", error);
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const updatePet = async (req, res) => {
  try {
    const petUpdateBody = req.body;
    const petId = req.params.pid;

    const result = await petsService.update(petId, petUpdateBody);
    if (!result) {
      logger.warn(`Pet not found for update: ${petId}`);
      return res.status(404).send({ status: "error", error: "Pet not found" });
    }

    logger.info(`Pet updated successfully: ${petId}`);
    res.send({ status: "success", message: "Pet updated" });
  } catch (error) {
    logger.error("Error updating pet:", error);
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const deletePet = async (req, res) => {
  try {
    const petId = req.params.pid;
    const result = await petsService.delete(petId);

    if (!result) {
      logger.warn(`Pet not found for deletion: ${petId}`);
      return res.status(404).send({ status: "error", error: "Pet not found" });
    }

    logger.info(`Pet deleted: ${petId}`);
    res.send({ status: "success", message: "Pet deleted" });
  } catch (error) {
    logger.error("Error deleting pet:", error);
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

const createPetWithImage = async (req, res) => {
  try {
    const file = req.file;
    const { name, specie, birthDate } = req.body;

    if (!name || !specie || !birthDate) {
      logger.warn("Incomplete values in createPetWithImage request");
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }

    if (!file) {
      logger.warn("No image file uploaded for new pet");
      return res
        .status(400)
        .send({ status: "error", error: "Image file is required" });
    }

    logger.debug("Uploaded file:", file);

    const pet = PetDTO.getPetInputFrom({
      name,
      specie,
      birthDate,
      image: `${__dirname}/../public/img/${file.filename}`,
    });

    logger.debug("New pet data prepared:", pet);

    const result = await petsService.create(pet);
    logger.info(`New pet with image created: ${result._id}`);

    res.send({ status: "success", payload: result });
  } catch (error) {
    logger.error("Error creating pet with image:", error);
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
};

export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
};
