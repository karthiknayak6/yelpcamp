if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ExpressError = require("./util/ExpressError");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
//route
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

// To remove data using these defaults:

const app = express();
// app.use(mongoSanitize());

// Or, to replace these prohibited characters with _, use:
app.use(
  mongoSanitize({
    replaceWith: "_",
  }),
);
const { nextTick } = require("process");
app.use(methodOverride("_method"));
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const User = require("./models/user");
const sessionConfig = {
  name: "session",
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// app.use(helmet({ contentSecurityPolicy: false }));

// const scriptSrcUrls = [
// 	"https://stackpath.bootstrapcdn.com/",
// 	"https://api.tiles.mapbox.com/",
// 	"https://api.mapbox.com/",
// 	"https://kit.fontawesome.com/",
// 	"https://cdnjs.cloudflare.com/",
// 	"https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
// 	"https://kit-free.fontawesome.com/",
// 	"https://stackpath.bootstrapcdn.com/",
// 	"https://api.mapbox.com/",
// 	"https://api.tiles.mapbox.com/",
// 	"https://fonts.googleapis.com/",
// 	"https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
// 	"https://api.mapbox.com/",
// 	"https://a.tiles.mapbox.com/",
// 	"https://b.tiles.mapbox.com/",
// 	"https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
// 	helmet.contentSecurityPolicy({
// 		directives: {
// 			defaultSrc: [],
// 			connectSrc: ["'self'", ...connectSrcUrls],
// 			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
// 			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
// 			workerSrc: ["'self'", "blob:"],
// 			objectSrc: [],
// 			// imgSrc: [
// 			// 	"'self'",
// 			// 	"blob:",
// 			// 	"data:",
// 			// 	"https://res.cloudinary.com/daaad4f50/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
// 			// 	"https://images.unsplash.com/",
// 			// ],
// 			fontSrc: ["'self'", ...fontSrcUrls],
// 		},
// 	})
// );

app.use((req, res, next) => {
  console.log(req.query);
  console.log(req.user);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Routes declaration

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);

const dbUrl = process.env.DB_URL;

mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No!! Something went wrong";
  res.status(statusCode);
  res.render("error", { err });

  next();
});

app.listen(3001, () => {
  console.log("RUNNING ON PORT 3001");
});
