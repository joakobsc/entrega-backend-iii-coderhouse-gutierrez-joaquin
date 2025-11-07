// test/adoptions.test.js
import chai from "chai";
import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app.js";
import userModel from "../src/dao/models/User.js";
import petModel from "../src/dao/models/Pet.js";
import adoptionModel from "../src/dao/models/Adoption.js";

const expect = chai.expect;

describe("Adoption Router - Functional Tests", function () {
  // Los tests pueden tardar un poquito por las operaciones con la DB
  this.timeout(10000);

  before(async () => {
    // Asegurarnos de que la conexión a Mongo está lista
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        "mongodb://localhost:27017/db_example?directConnection=true"
      );
    }
  });

  beforeEach(async () => {
    // Limpiar colecciones antes de cada test
    await adoptionModel.deleteMany({});
    await petModel.deleteMany({});
    await userModel.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("GET /api/adoptions/ debe devolver un array (inicialmente vacío)", async () => {
    const res = await request(app).get("/api/adoptions").expect(200);

    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("payload");
    expect(res.body.payload).to.be.an("array");
    expect(res.body.payload).to.have.length(0);
  });

  it("GET /api/adoptions/:aid debe devolver una adopción existente", async () => {
    // Crear user y pet
    const user = await userModel.create({
      first_name: "Juan",
      last_name: "Pérez",
      email: "juan@example.com",
      password: "hashedpwd",
      role: "user",
      pets: [],
    });

    const pet = await petModel.create({
      name: "Michi",
      specie: "cat",
      adopted: true,
      owner: user._id,
    });

    // Crear adopción asociada
    const adoption = await adoptionModel.create({
      owner: user._id,
      pet: pet._id,
    });

    const res = await request(app)
      .get(`/api/adoptions/${adoption._id}`)
      .expect(200);

    expect(res.body.status).to.equal("success");
    expect(res.body.payload).to.have.property("_id");
    expect(res.body.payload.owner.toString()).to.equal(user._id.toString());
    expect(res.body.payload.pet.toString()).to.equal(pet._id.toString());
  });

  it("GET /api/adoptions/:aid debe devolver 404 si la adopción no existe", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app).get(`/api/adoptions/${fakeId}`).expect(404);

    expect(res.body.status).to.equal("error");
    expect(res.body.error).to.equal("Adoption not found");
  });

  it("POST /api/adoptions/:uid/:pid debe crear una adopción válida", async () => {
    // 1) Crear usuario y mascota no adoptada
    const user = await userModel.create({
      first_name: "Ana",
      last_name: "García",
      email: "ana@example.com",
      password: "hashedpwd",
      role: "user",
      pets: [],
    });

    const pet = await petModel.create({
      name: "Firulais",
      specie: "dog",
      adopted: false,
    });

    // 2) Hacer la request a la API
    const res = await request(app)
      .post(`/api/adoptions/${user._id}/${pet._id}`)
      .expect(200);

    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("Pet adopted");

    // 3) Verificar efectos en la DB

    const updatedUser = await userModel.findById(user._id);
    const updatedPet = await petModel.findById(pet._id);
    const adoptions = await adoptionModel.find({
      owner: user._id,
      pet: pet._id,
    });

    // El usuario debe tener la mascota en su array de pets
    const userPetIds = updatedUser.pets.map((p) => p._id.toString());
    expect(userPetIds).to.include(pet._id.toString());

    // La mascota debe estar marcada como adoptada y con owner correcto
    expect(updatedPet.adopted).to.equal(true);
    expect(updatedPet.owner.toString()).to.equal(user._id.toString());

    // Debe existir una adopción registrada
    expect(adoptions).to.have.length(1);
  });

  it("POST /api/adoptions/:uid/:pid debe devolver 404 si el usuario no existe", async () => {
    const fakeUserId = new mongoose.Types.ObjectId();
    const pet = await petModel.create({
      name: "Niebla",
      specie: "cat",
      adopted: false,
    });

    const res = await request(app)
      .post(`/api/adoptions/${fakeUserId}/${pet._id}`)
      .expect(404);

    expect(res.body.status).to.equal("error");
    expect(res.body.error).to.equal("user Not found");
  });

  it("POST /api/adoptions/:uid/:pid debe devolver 404 si la mascota no existe", async () => {
    const user = await userModel.create({
      first_name: "Luis",
      last_name: "Sánchez",
      email: "luis@example.com",
      password: "hashedpwd",
      role: "user",
      pets: [],
    });

    const fakePetId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/adoptions/${user._id}/${fakePetId}`)
      .expect(404);

    expect(res.body.status).to.equal("error");
    expect(res.body.error).to.equal("Pet not found");
  });

  it("POST /api/adoptions/:uid/:pid debe devolver 400 si la mascota ya está adoptada", async () => {
    const user = await userModel.create({
      first_name: "Carla",
      last_name: "Díaz",
      email: "carla@example.com",
      password: "hashedpwd",
      role: "user",
      pets: [],
    });

    const pet = await petModel.create({
      name: "Rex",
      specie: "dog",
      adopted: true, // 👈 ya adoptada
      owner: user._id,
    });

    const res = await request(app)
      .post(`/api/adoptions/${user._id}/${pet._id}`)
      .expect(400);

    expect(res.body.status).to.equal("error");
    expect(res.body.error).to.equal("Pet is already adopted");
  });
});
