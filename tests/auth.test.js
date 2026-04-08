const request = require("supertest");

const mongoose = require("mongoose");
const { startTestDb, stopTestDb, clearDb } = require("./helpers/testDb");

let app;

beforeAll(async () => {
	process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
	process.env.SESSION_SECRET =
		process.env.SESSION_SECRET || "test_session_secret";
	process.env.MONGO_URI =
		process.env.MONGO_URI || "mongodb://localhost:27017/ignore";

	await startTestDb();

	jest.spyOn(mongoose, "connect").mockResolvedValue(mongoose);
	app = require("../app");
});

afterAll(async () => {
	await stopTestDb();
});

afterEach(async () => {
	await clearDb();
});

describe("Auth", () => {
	test("GET /register returns 200", async () => {
		const res = await request(app).get("/register");
		expect(res.status).toBe(200);
	});

	test("POST /register creates user and redirects to /tasks", async () => {
		const res = await request(app).post("/register").type("form").send({
			name: "Peter",
			email: "peter@gmail.com",
			password: "password123",
			confirmPassword: "password123",
		});

		expect(res.status).toBe(302);
		expect(res.headers.location).toBe("/tasks");
		expect(res.headers["set-cookie"]).toBeTruthy();
	});

	test("POST /login with wrong password redirects to /login", async () => {
		// register first
		await request(app).post("/register").type("form").send({
			name: "Peter",
			email: "peter@gmail.com",
			password: "password123",
			confirmPassword: "password123",
		});

		const res = await request(app)
			.post("/login")
			.type("form")
			.send({ email: "peter@gmail.com", password: "wrongpassword" });

		expect(res.status).toBe(302);
		expect(res.headers.location).toBe("/login");
	});

	test("POST /login with valid credentials redirects to /tasks", async () => {
		await request(app).post("/register").type("form").send({
			name: "Peter",
			email: "peter@gmail.com",
			password: "password123",
			confirmPassword: "password123",
		});

		const res = await request(app)
			.post("/login")
			.type("form")
			.send({ email: "peter@gmail.com", password: "password123" });

		expect(res.status).toBe(302);
		expect(res.headers.location).toBe("/tasks");
		expect(res.headers["set-cookie"]).toBeTruthy();
	});
});
