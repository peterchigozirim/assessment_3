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

async function registerAndGetAgent() {
	const agent = request.agent(app);
	await agent.post("/register").type("form").send({
		name: "Peter",
		email: "peter@gmail.com",
		password: "password123",
		confirmPassword: "password123",
	});
	return agent;
}

describe("Tasks", () => {
	test("GET /tasks redirects to /login when not authenticated", async () => {
		const res = await request(app).get("/tasks");
		expect(res.status).toBe(302);
		expect(res.headers.location).toBe("/login");
	});

	test("Authenticated user can create a task and see it in /tasks", async () => {
		const agent = await registerAndGetAgent();

		const createRes = await agent
			.post("/tasks")
			.type("form")
			.send({ title: "My first task" });

		expect(createRes.status).toBe(302);
		expect(createRes.headers.location).toBe("/tasks");

		const listRes = await agent.get("/tasks");
		expect(listRes.status).toBe(200);
		expect(listRes.text).toContain("My first task");
	});

	test("Authenticated user can toggle a task", async () => {
		const agent = await registerAndGetAgent();

		await agent.post("/tasks").type("form").send({ title: "Toggle me" });

		// find the task id via mongoose model
		const Task = require("../Models/Task");
		const task = await Task.findOne({ title: "Toggle me" });

		const toggleRes = await agent
			.post(`/tasks/${task._id}/toggle`)
			.type("form");
		expect(toggleRes.status).toBe(302);

		const updated = await Task.findById(task._id);
		expect(updated.status).toBe("completed");
	});

	test("Authenticated user can delete a task", async () => {
		const agent = await registerAndGetAgent();

		await agent.post("/tasks").type("form").send({ title: "Delete me" });

		const Task = require("../Models/Task");
		const task = await Task.findOne({ title: "Delete me" });

		const delRes = await agent.post(`/tasks/${task._id}/delete`).type("form");
		expect(delRes.status).toBe(302);

		const gone = await Task.findById(task._id);
		expect(gone).toBeNull();
	});
});
