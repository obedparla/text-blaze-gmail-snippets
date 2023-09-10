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

      return await Promise.all(
        messageIds.map((id) =>
          gmail.users.messages.get({
            userId: "me",
            id: `${id}`,
          }),
        ),
      );
    }
  } catch (error) {
    return { error };
  }
}

// From: https://stackoverflow.com/a/61552282/5993042
export function getPlainTextEmailWithNoHistory(
  message: gmail_v1.Schema$Message,
) {
  const fromEmail = getGoogleMessageEmailFromHeader("From", message);
  const toEmail = getGoogleMessageEmailFromHeader("To", message);

  const parser = new ParseGmailApi();
  let plainTextEmail = parser.parseMessage(message).textPlain.trim();

  // We need to remove history of email.
  // History starts with e.g.: 'On Thu, Apr 30, 2020 at 8:29 PM John Doe <john.doe@example.com> wrote:'
  //
  // We also don't know who wrote the last message in history, so we use the email that
  // we meet first: 'fromEmail' or 'toEmail'
  const fromEmailWithArrows = `<${fromEmail}>`;
  const toEmailWithArrows = `<${toEmail}>`;

  const isEmailWithHistory =
    (!!fromEmail && plainTextEmail.indexOf(fromEmailWithArrows) > -1) ||
    (!!toEmail && plainTextEmail.indexOf(toEmailWithArrows) > -1);

  if (!isEmailWithHistory) {
    return plainTextEmail;
  }

  // First history email with arrows
  const historyEmailWithArrows = findFirstSubstring(
    fromEmailWithArrows,
    toEmailWithArrows,
    plainTextEmail,
  );

  // Remove everything after `<${fromEmail}>`
  let emailWithNoHistory = plainTextEmail.substring(
    0,
    plainTextEmail.indexOf(historyEmailWithArrows) +
      historyEmailWithArrows.length,
  );

  // Remove line that contains `<${fromEmail}>`
  const fromRegExp = new RegExp(`^.*${historyEmailWithArrows}.*$`, "mg");
  emailWithNoHistory = emailWithNoHistory.replace(fromRegExp, "");

  return emailWithNoHistory;
}

function getGoogleMessageEmailFromHeader(
  headerName: string,
  message: gmail_v1.Schema$Message,
) {
  const header = message.payload?.headers?.find(
    (header) => header.name === headerName,
  );

  const headerValue = header?.value; // John Doe <john.doe@example.com>

  if (!header || !headerValue) {
    return null;
  }

  const email = headerValue.substring(
    headerValue.lastIndexOf("<") + 1,
    headerValue.lastIndexOf(">"),
  );

  return email;
}

function findFirstSubstring(strA: string, strB: string, str: string) {
  if (str.indexOf(strA) === -1) return strB;
  if (str.indexOf(strB) === -1) return strA;

  return str.indexOf(strA) < str.indexOf(strB) ? strA : strB;
}
