import express from "express";
import { getEmails, getPlainTextEmailWithNoHistory } from "../lib/gmail";
import { getSnippetsFromText } from "../lib/snippets";

const router = express.Router();

router.post("/gmail-snippets", async (req, res) => {
  if (req.isAuthenticated() && req.user.accessToken) {
    const maybeEmailsData = await getEmails(
      req.user.accessToken,
      req.body?.numberOfEmails || 20,
    ).catch((e) => res.send({ error: e }));

    if (!maybeEmailsData) {
      res.statusCode = 500;
      res.send({ error: "Could not retrieve emails" });

    } else if ("error" in maybeEmailsData) {
      res.statusCode = 500;
      res.send({ error: maybeEmailsData.error });
    } else if ("emails" in maybeEmailsData) {
      try {
        if (maybeEmailsData.newAccessToken){
          req.user.accessToken = maybeEmailsData.newAccessToken;
        }

        const plainTextEmailBodies = maybeEmailsData.emails.map((email) =>
          getPlainTextEmailWithNoHistory(email.data),
        );

        const snippets = getSnippetsFromText(
          plainTextEmailBodies,
          req.body?.sensitivity,
        );

        res.send({
          snippets,
          // not used, but this would be useful when implementing pagination
          // nextPageToken: maybeEmailsData.nextPageToken,
        });

      } catch (e) {
        res.statusCode = 401;
        res.send({ error: e });
      }
    }

    return;
  }
});

export { router as SnippetsRoutes };
