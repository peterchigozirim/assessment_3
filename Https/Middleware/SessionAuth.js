const jwt = require("jsonwebtoken");

/**
 * Session-based auth guard for EJS pages.
 * Expects req.session.token to exist (set on login/register).
 */
const requireAuth = (req, res, next) => {
	const token = req.session?.token;
	if (!token) return res.redirect("/login");

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // { id, email, iat, exp }
		next();
	} catch (e) {
		req.session.token = null;
		return res.redirect("/login");
	}
};

const attachUser = (req, res, next) => {
	res.locals.user = req.session?.user || null;
	res.locals.messages = req.flash();
	next();
};

module.exports = { requireAuth, attachUser };
