import dotenv from "dotenv";

dotenv.config();

import express from "express";
import ViteExpress from "vite-express";
import session from "express-session";
import passport from "passport";
import { AuthRoutes } from "./routes/auth.route";
import { passportGoogleStrategy } from "./middleware/passport";
import { SnippetsRoutes } from "./routes/snippets.route";
import { UserRoutes } from "./routes/user.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((obj: Express.User, done) => {
  done(null, obj);
});

passport.use("google", passportGoogleStrategy);

app.use(AuthRoutes);
app.use("/v1", SnippetsRoutes);
app.use("/v1", UserRoutes);

// port is hardcoded since it's in the whitelist for google auth
ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
