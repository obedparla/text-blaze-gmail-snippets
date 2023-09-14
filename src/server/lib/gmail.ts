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

export async function getEmails(accessToken: string, maxResults: number) {
  const oauth2Client = new google.auth.OAuth2();

  if (!accessToken) return null;

  oauth2Client.setCredentials({ access_token: accessToken });

  const maybeNewAccessToken = await refreshAccessTokenIfNeeded(
    oauth2Client,
    accessToken,
  );

  if (!maybeNewAccessToken) {
    return null;
  }

  try {
    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: maxResults,
      labelIds: ["SENT"],
    });

    if (response) {
      const messageIds =
        response.data.messages?.flatMap((msg) => (msg.id ? [msg.id] : [])) ??
        [];

      const emails = await Promise.all(
              messageIds.map((id) =>
                  gmail.users.messages.get({
                    userId: "me",
                    id: `${id}`,
                  }),
              ),
          );

      return {
        nextPageToken: response.data.nextPageToken,
        emails,
        newAccessToken: maybeNewAccessToken
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
  const plainTextEmail = parser.parseMessage(message).textPlain.trim();

  return removeHistory(plainTextEmail);
}

/**
 * A gmail email can have "history" at the end of the email. It starts with "On Thu, <date> .... <obed parlapiano ...> wrote:
 * Remove that history to leave the email only with the body content
 *
 * Note: a side-effect on this function is that any quote from the email body will also be removed, since it removes any line starting with ">"
 * @param emailText
 */
function removeHistory(emailText: string) {
  // remove "On Sat, Jul 8, 2023 at 4:44 Test Support <support@test.com>\r\nwrote:"
  const emailTextWithoutHistoryLabel = emailText.replace(/on[\s\S]+<[\s\S]+>[\s\S]+wrote:/gmi, '')
  const textSeparatedByNewLines = emailTextWithoutHistoryLabel.split(/\r?\n/gm);

  const textLinesWithNoQuotes = [];

  for (const line of textSeparatedByNewLines) {
    if (!line.startsWith(">") && line) {
      textLinesWithNoQuotes.push(line);
    }
  }

  const lastLine = textLinesWithNoQuotes[textLinesWithNoQuotes.length - 1];
  if (
      lastLine &&
      lastLine.endsWith("> wrote:")
  ) {
    textLinesWithNoQuotes.pop();
  }

  return textLinesWithNoQuotes.join("\r\n");
}
