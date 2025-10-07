// src/mocks/mocking.js
import mongoose from "mongoose";

const ROLES = ["user", "admin"];
const SPECIES = ["dog", "cat", "bird", "hamster", "other"];
const NOMBRES = [
  "Luna",
  "Max",
  "Milo",
  "Nina",
  "Tobi",
  "Olivia",
  "Simba",
  "Mia",
  "Rocky",
  "Lola",
  "Coco",
  "Leo",
  "Sofi",
  "Chloe",
  "Tom",
];
const APELLIDOS = [
  "García",
  "López",
  "Martínez",
  "Rodríguez",
  "Sánchez",
  "Pérez",
  "Gómez",
  "Díaz",
  "Fernández",
  "Romero",
  "Ruiz",
  "Torres",
];

const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const objectId = () => new mongoose.Types.ObjectId();

// Mocks EN MEMORIA

export function generateMockPets(count = 20) {
  return Array.from({ length: count }, () => ({
    _id: objectId(),
    name: randomPick(NOMBRES),
    specie: randomPick(SPECIES),
    adopted: Math.random() < 0.5,
    __v: 0,
  }));
}

// Genera usuarios mock estilo Mongo (para GET).

export function generateMockUsers(count = 50, preHashedPwd) {
  if (!preHashedPwd) throw new Error("generateMockUsers: falta preHashedPwd");
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const first_name = randomPick(NOMBRES);
    const last_name = randomPick(APELLIDOS);
    const email =
      `${first_name}.${last_name}.${now}_${i}@example.com`.toLowerCase();
    return {
      _id: objectId(),
      first_name,
      last_name,
      email,
      password: preHashedPwd, // encripta contraseña
      role: randomPick(ROLES),
      pets: [],
      __v: 0,
    };
  });
}

export function buildUsersForInsert(count = 0, preHashedPwd) {
  if (!preHashedPwd) throw new Error("buildUsersForInsert: falta preHashedPwd");
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const first_name = randomPick(NOMBRES);
    const last_name = randomPick(APELLIDOS);
    const email =
      `${first_name}.${last_name}.${now}_${i}@example.com`.toLowerCase();
    return {
      first_name,
      last_name,
      email,
      password: preHashedPwd,
      role: randomPick(ROLES),
      pets: [],
    };
  });
}

export function buildPetsForInsert(count = 0) {
  return Array.from({ length: count }, () => ({
    name: randomPick(NOMBRES),
    specie: randomPick(SPECIES),
    adopted: Math.random() < 0.5,
  }));
}
