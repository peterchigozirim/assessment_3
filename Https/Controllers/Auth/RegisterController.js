const User = require("@/Models/User");

const registerController = async (req, res) => {
	const { name, email, password } = req.body;
	const existing = await User.findOne({ email });
	if (existing) {
		req.flash("error", "User already exists");
		return res.redirect("/register");
	}
	const user = await User.create({ name, email, password });
	const token = user.generateAuthToken();
	req.session.token = token;
	req.session.user = {
		id: user._id.toString(),
		email: user.email,
		name: user.name,
	};
	return res.redirect("/tasks");
};

module.exports = registerController;
