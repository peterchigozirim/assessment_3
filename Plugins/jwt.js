const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_SECRET || "jwt_secret";

const generateToken = ({ email, userId }) => {
	return jwt.sign({ email, userId }, secret, { expiresIn: "1h" });
};

const verifyToken = (token) => {
	return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken };
