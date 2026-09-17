# Gate Guardian

Build a mobile-first Progressive Web App for security guards at a residential society gate to log visitor entries and check approval status. This will run on an Android tablet mounted at the gate, used continuously by guards in shifts, often in bright sunlight outdoors — so prioritize large touch targets, high contrast, and minimal text entry.

SCREENS NEEDED:

1. LOGIN

- Simple phone number + PIN login (4-digit PIN, numeric keypad UI)

- Show gate name/number after login (e.g. "Main Gate - Shift A")

- Persistent session (don't require re-login every use)

2. NEW VISITOR ENTRY (primary screen, should be the default/home screen after login)

- Flat number field with autocomplete/search-as-you-type (mock data: flat numbers like A-101, A-102, B-201 etc, 50 sample flats)

- Visitor name (text input)

- Visitor phone number (numeric input, optional)

- Purpose dropdown: Guest, Delivery, Cab/Taxi, Service Staff (maid/driver/plumber), Courier, Other

- Photo capture button that opens device camera and shows a preview thumbnail before submit

- Large "Send for Approval" submit button (full width, high contrast)

- After submit, show a status card: "Waiting for approval from A-101..." with a pulsing/loading indicator

- Status card should support three states with distinct colors: Pending (yellow/amber), Approved (green, with a checkmark and "Entry Allowed" text), Denied (red, with "Entry Denied" text)

3. TODAY'S ENTRY LOG

- List view of all entries logged today, most recent first

- Each row: visitor name, flat number, purpose, time, status badge (Pending/Approved/Denied/Manual)

- Search bar at top to filter by flat number or visitor name

- Tap a row to expand and see photo + full details

4. MANUAL ENTRY (for known deliveries without waiting for approval)

- Simplified version of the new entry form

- Clear visual flag/badge marking these as "Manual Entry - Unverified" in the log

- Confirmation dialog before submit: "This entry will not require resident approval. Continue?"

5. BOTTOM NAVIGATION (persistent across screens)

- Three tabs: New Entry (home), Today's Log, Manual Entry

- Simple icons + labels, large tap targets

DESIGN DIRECTION:

- Clean, high-contrast, functional — this is a utility tool, not a consumer app. Avoid excessive decoration.

- Primary color: a strong blue or teal for actions, green for approved states, amber for pending, red for denied

- Large, legible typography — guards may be using this in gloves or with wet hands, so avoid tiny tap targets

- Bottom navigation should be thumb-reachable on a tablet held in landscape or portrait

- Include a small offline indicator badge (top corner) that shows when the device loses connectivity

Use mock/placeholder data for the flat list and today's log so the screens are fully browsable. No backend integration needed yet — I'll wire this to a real API separately.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9bd617a9-73b9-47b0-955f-7ee1f794c28c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
