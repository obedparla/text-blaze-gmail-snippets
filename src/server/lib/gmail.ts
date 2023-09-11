import { gmail_v1, google } from "googleapis";
import { ParseGmailApi } from "gmail-api-parse-message-ts";
import { OAuth2Client } from "google-auth-library";

async function isTokenValid(oauth2Client: OAuth2Client, accessToken: string) {
  try {
    const tokenInfo = await oauth2Client.getTokenInfo(accessToken);
    return (
      tokenInfo && tokenInfo.expiry_date && tokenInfo.expiry_date > Date.now()
    );
  } catch (error) {
    return false;
  }
}

async function refreshAccessTokenIfNeeded(
  oauth2Client: OAuth2Client,
  accessToken: string,
) {
  if (!(await isTokenValid(oauth2Client, accessToken))) {
    const newTokens = await oauth2Client.refreshAccessToken();

    oauth2Client.setCredentials(newTokens.credentials);
    return newTokens.credentials.access_token;
  } else {
    return accessToken;
  }
}

export async function getEmails(req: Express.Request, maxResults: number) {
  const oauth2Client = new google.auth.OAuth2();

  const accessToken = req.user.accessToken;

  if (!accessToken) return null;

  oauth2Client.setCredentials({ access_token: accessToken });

  const maybeNewAccessToken = await refreshAccessTokenIfNeeded(
    oauth2Client,
    accessToken,
  );

  if (!maybeNewAccessToken) {
    return null;
  }

  req.user.accessToken = maybeNewAccessToken;

  try {
    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    let response = await gmail.users.messages.list({
      userId: "me",
      maxResults: maxResults,
      labelIds: ["SENT"],
    });

    if (response) {
      let messageIds =
        response.data.messages?.flatMap((msg) => (msg.id ? [msg.id] : [])) ??
        [];

      return {
        nextPageToken: response.data.nextPageToken,
        emails: await Promise.all(
          messageIds.map((id) =>
            gmail.users.messages.get({
              userId: "me",
              id: `${id}`,
            }),
          ),
        ),
      };
    }
  } catch (error) {
    return { error };
  }
}

export function getPlainTextEmailWithNoHistory(
  message: gmail_v1.Schema$Message,
) {
  const parser = new ParseGmailApi();
  let plainTextEmail = parser.parseMessage(message).textPlain.trim();

  // return plainTextEmail;

  return removeHistory(plainTextEmail);
}

function removeHistory(emailText: string) {
  const textLines = emailText.split(/\r?\n/gm);

  let textLinesWithNoQuotes = [];

  for (let line of textLines) {
    if (!line.startsWith(">") && line) {
      textLinesWithNoQuotes.push(line);
    }
  }

  if (
    textLinesWithNoQuotes.length > 0 &&
    textLinesWithNoQuotes[textLinesWithNoQuotes.length - 1].endsWith("> wrote:")
  ) {
    textLinesWithNoQuotes.pop();
  }

  return textLinesWithNoQuotes.join("\r\n");
}
