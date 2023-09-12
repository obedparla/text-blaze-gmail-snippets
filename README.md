# Text Blaze Gmail Snippets Test - Obed Parlapiano

Get snippets of text you've reused in sent emails.

## Run

For running the app in dev mode: `npm run dev`. For production first build the frontend with `npm run build` and then
run the server: `npm run start`

## Stack

- React: for the frontend
- Node.js + Express for the backend
- Passport for Google's oAuth2
- "wink-nlp" and "natural" for Natural Language Processing (snippet generation, more on that below)
- Chakra.ui for UI components. Made it easier to quickly prototype the UI
- React Query for fetching data and state management

## Solution and challenges for finding snippets

This was the most complex part of the app as I hadn't worked with natural language processing before. I found the "
natural" library which seemed to be a great choice, however, their tokenization functions aren't great and that led to
having sub-par snippets. After going down a rabbit hole of trying to fix it with custom code, I decided to test other
tokenization libraries and "wink-nlp" had the best one I tried. It dramatically improved snippets. After some
fine-tuning of distance thresholds, algorithms, and cleaning up the initial text I'm pretty happy with the result.

There was a problem when trying to create the snippets from sent emails, because they also contain the email "history".
Parts of previous emails quoted automatically. Gmail doesn't have a way to remove
this from their response, and it was messing up the snippets logic by creating snippets for sentences the user didn't
write. I solved it by removing all quoted text from the email's content.

## Improvements for a production app

There are improvements I would do for a production app. Most noteworthy points:

### Authentication

The authentication should be more reliable. Right now
it's using Express' sessions to keep track of the access tokens and user data, which isn't a good solution for a
production app, but simplifies the app a lot by not requiring a database. I also didn't have time to properly tests if
the access tokens are being refreshed correctly or what happens when a re-login is required.

There's also no code to log-out of the app. I decided my time was better spent making the UI and the snippet logic
better.

### Tests

I'd implement further tests for crucial features such as the snippets logic (I added a basic test just to showcase a test), and E2E for the "happy path" (logging in, getting data).

### Extra UI features

The prototype has some filtering, but I ran out of time to implement pagination, which would dramatically improve the
UX. I would also like to add a "copy" function next to each snippet, an option to filter by sentence length (sentences
with more than 2 words, or only short ones).

### Routing

Since the app is so simple I decided not to add React Router, but in a production environment the redirection for
authentication and dashboard should be handled by it.

### State management

The app uses React Query which is sufficient for a lot of apps, but in a big application with more global state, I'd
implement a state magement library such as Zustand or Redux.
