require("module-alias/register");

const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./configs/db");
const AuthRoute = require("./Routes/AuthRoute");
require("dotenv").config();

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const path = require("path");
const ViewRoutes = require("./Routes/ViewRoutes");
const { attachUser } = require("@/Https/Middleware/SessionAuth");

const port = process.env.PORT || 3040;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

// Sessions (for UI)
app.use(cookieParser());
app.use(
	session({
		secret:
			process.env.SESSION_SECRET || process.env.JWT_SECRET || "dev_secret",
		resave: false,
		saveUninitialized: false,
		cookie: { httpOnly: true },
	}),
);
app.use(flash());
app.use(attachUser);

connectDB();

// API routes
app.use(AuthRoute);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
