import { google } from "googleapis";
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
