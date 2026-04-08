const User = require("@/Models/User");

const LoginController = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email: email?.toLowerCase().trim() });
	if (!user) {
		req.flash("error", "Credentials not found.");
		return res.redirect("/login");
	}
	const ok = await user.comparePassword(password);
	if (!ok) {
		req.flash("error", "Invalid password.");
		return res.redirect("/login");
	}
	const token = user.generateAuthToken();
	req.session.token = token;
	req.session.user = {
		id: user._id.toString(),
		email: user.email,
		name: user.name,
	};
	return res.redirect("/tasks");
};

module.exports = LoginController;
