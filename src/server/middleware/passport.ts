import googleStrategy from "passport-google-oauth20";
import { Profile } from "passport";

const GoogleStrategy = googleStrategy.Strategy;
const passportGoogleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "/auth/google/callback",
  },
  (accessToken, refreshToken, profile, done) => {
    const profileWithTokens: Profile & {
      accessToken: string;
      refreshToken: string;
    } = { ...profile, accessToken, refreshToken };

    return done(null, profileWithTokens);
  },
);

export { passportGoogleStrategy };
