const { verifyToken } = require("@/Plugins/jwt");

const verifyTokenMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ message: "Authorization header missing" });
	}
	const token = authHeader.split(" ")[1];
	try {
		const decoded = verifyToken(token);
		req.user = decoded; // Attach decoded token data to request object
		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		return res.status(401).json({ message: "Invalid token" });
	}
};

module.exports = verifyTokenMiddleware;
