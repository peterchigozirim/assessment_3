/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: "node",
	testMatch: ["**/tests/**/*.test.js"],
	clearMocks: true,
	restoreMocks: true,
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
};
