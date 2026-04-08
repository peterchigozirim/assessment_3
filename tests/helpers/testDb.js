const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

async function startTestDb() {
	mongod = await MongoMemoryServer.create();
	const uri = mongod.getUri();
	await mongoose.connect(uri);
	return uri;
}

async function stopTestDb() {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	if (mongod) await mongod.stop();
}

async function clearDb() {
	const collections = mongoose.connection.collections;
	for (const key of Object.keys(collections)) {
		await collections[key].deleteMany({});
	}
}

module.exports = { startTestDb, stopTestDb, clearDb };
