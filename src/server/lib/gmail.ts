import { gmail_v1, google } from "googleapis";
import { ParseGmailApi } from "gmail-api-parse-message-ts";

export async function getEmails(accessToken: string, maxResults: number) {
  const oauth2Client = new google.auth.OAuth2();

  oauth2Client.setCredentials({ access_token: accessToken });

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
