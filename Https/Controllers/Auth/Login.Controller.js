const User = require("@/Models/User");

const LoginController = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email: email.toLowerCase().trim() });
		if (!user) {
			return res.status(404).json({ message: "Credentials not found." });
		}

		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid password." });
		}
		const token = await user.generateAuthToken({
			email: user.email,
			userId: user._id,
		});
		res
			.status(200)
			.json({ message: "Login successful.", user: user, token: token });
	} catch (error) {
		res.status(500).json({
			message:
				"An error occurred while processing your request." + error.message,
		});
	}
};

module.exports = LoginController;
