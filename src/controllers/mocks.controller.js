import { usersService, petsService } from "../services/index.js";
import { createHash } from "../utils/index.js";
import {
  generateMockPets,
  generateMockUsers,
  buildUsersForInsert,
  buildPetsForInsert,
} from "../mocks/mocking.js";

const mockingPets = (req, res) => {
  const count = Number(req.query.count) || 20;
  const payload = generateMockPets(count);
  return res
    .status(200)
    .send({ status: "success", count: payload.length, payload });
};

const mockingUsers = async (req, res) => {
  const count = Number(req.query.count) || 50;
  const hashed = await createHash("coder123"); // consigna
  const payload = generateMockUsers(count, hashed);
  return res
    .status(200)
    .send({ status: "success", count: payload.length, payload });
};

const generateData = async (req, res) => {
  try {
    const usersQty = Number(req.body?.users) || 0;
    const petsQty = Number(req.body?.pets) || 0;
    if (usersQty < 0 || petsQty < 0) {
      return res
        .status(400)
        .send({ status: "error", error: "Parámetros inválidos" });
    }

    const hashed = await createHash("coder123");
    const usersToInsert = buildUsersForInsert(usersQty, hashed);
    const petsToInsert = buildPetsForInsert(petsQty);

    let insertedUsers = 0;
    for (const u of usersToInsert) {
      await usersService.create(u);
      insertedUsers++;
    }

    let insertedPets = 0;
    for (const p of petsToInsert) {
      await petsService.create(p);
      insertedPets++;
    }

    return res.status(201).send({
      status: "success",
      inserted: { users: insertedUsers, pets: insertedPets },
    });
  } catch (err) {
    return res.status(500).send({ status: "error", error: err.message });
  }
};

export default {
  mockingPets,
  mockingUsers,
  generateData,
};
