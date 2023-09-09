import express from "express";
import ViteExpress from "vite-express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import { AuthRoutes } from "./routes/auth.route";
import { passportGoogleStrategy } from "./middleware/passport";
import { GmailRoutes } from "./routes/gmail.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());

app.use(
  session({
    // todo get from .env
    secret: "some_random_secret",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// todo don't save the entire user object
passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((obj: Express.User, done) => {
  done(null, obj);
});

passport.use("google", passportGoogleStrategy);

app.use(AuthRoutes);
app.use(GmailRoutes);

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
