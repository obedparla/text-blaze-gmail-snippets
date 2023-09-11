import googleStrategy from "passport-google-oauth20";
import { Profile } from "passport";

const GoogleStrategy = googleStrategy.Strategy;

const passportGoogleStrategy = new GoogleStrategy(
  {
    // todo get from .env
    clientID:
      "672582507788-7krtf8ukh00brnjca4a2febiqb1gf8ts.apps.googleusercontent.com",
    clientSecret: "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",
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
