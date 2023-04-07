const User = require("../models/user");

const renderRegister = (req, res) => {
	res.render("users/register");
};

const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash("success", "Welcome to Yelp Camp!");
			res.redirect("/campgrounds");
		});
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("register");
	}
};

const login = (req, res) => {
	req.flash("success", "welcome back");

	const redirectedUrl = req.session.returnTo || "/campgrounds";
	// delete req.session.returnTo;
	res.redirect(redirectedUrl);
};

const renderLogin = (req, res) => {
	res.render("users/login");
};

const logout = (req, res) => {
	req.logout(() => {
		req.flash("success", "Good Bye!");
		res.redirect("/campgrounds");
	});
};

module.exports = { renderRegister, register, login, renderLogin, logout };
