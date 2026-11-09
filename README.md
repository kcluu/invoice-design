# invoice-design

Customer invoices for Northstar Metrics, a B2B SaaS company: create, view, edit, send, record payment, void and delete, plus drafting an invoice from a plain text billing request with Claude.

- `client/` React + TypeScript (Vite, styled-components)
- `server/` Node + TypeScript API (Express) backed by Postgres
- `data/invoices.json` seed data and example billing requests

## Running it

You need Node 20+ and Docker (or any Postgres 14+).

```bash
npm install
npm run db:up                         # postgres 16 in docker on :5432
cp server/.env.example server/.env    # add ANTHROPIC_API_KEY to draft with Claude (optional)
npm run db:reset --workspace server   # creates the table and loads data/invoices.json
npm run dev:server                    # api on http://localhost:4000
npm run dev:client                    # app on http://localhost:5173
```

The seed data is dated May 2026, so "today" is `AS_OF_DATE` (defaults to the seed's `currentDate`, 2026-05-04). Change it in `server/.env` to see invoices age.

## Tests

```bash
npm test                              # both workspaces
npm test --workspace server           # validation, lifecycle rules, routes, both drafters
npm test --workspace client           # hooks, utils and components
```

Server tests use an in-memory repository and never call Claude, so they need no database or API key.

## Design decisions

The users are AR and finance staff. Their questions are "what's owed, what's late, what do I chase today", and their mistakes are costly, because a wrong invoice reaches a customer and the books. The design favors clarity and safe defaults over speed.

- **The list answers the triage question first.** Summary cards for outstanding, overdue, due in the next 14 days and drafts double as filters. The due column says "12 days overdue" or "Due in 9 days" rather than a bare date, and is colored by urgency for easy attention to important invoices.
- **Status is unambiguous.** Each status pill differs in shape as well as color, so it doesn't rely on color alone. Draft is a dashed outline (not issued yet) and Void is filled gray (closed). A banner on the detail page says what state the invoice is in and what to do next.
- **The lifecycle follows accounting rules.** Draft → Sent (Open or Overdue) → Paid, or Sent → Void.
  - Only drafts can be deleted. Anything a customer has seen is voided instead, so it stays on record with its history and the invoice numbers have no gaps.
  - Once an invoice is sent, the customer, money and line items are locked. Only the dates, terms and memo can change.
  - Sending re-dates a draft to the send day, so the customer gets their full terms.
- **Actions only appear when they're valid.** Menus show only the actions the status allows and explain missing ones so users can self-serve themselves ("Sent invoices can't be deleted. Void it instead."). Rather than disabled button states.
- **Data entry is forgiving.** Picking a customer autofills in their usual email, address, currency, terms and tax for increased input speed. The due date follows the terms until it's set by hand. Errors show next to each field and in a summary.
- **AI drafts, a person decides.** Draft from text only fills the form. Anything inferred, copied from history or ambiguous is listed under "Check these before sending", and nothing is saved until someone reviews it ensuring data integrity.
- **Built to be accessible:** keyboard support throughout (menu button, select and combobox patterns, a focus-trapped delete dialog, a skip link).

## Technical decisions

### Persistence

- **Postgres, one `invoices` table.** Line items and the activity log are `jsonb` columns on the row. An invoice is always read and written as a whole, so this keeps it to one query per read and matches the seed file's shape.
- **Constraints in two places.**
  - Postgres enforces the basics: status values, terms, memo length, `due_date >= issue_date`, and tax between 0 and 1 (percentage as decimal).
  - zod validates everything else before a write, and failures come back with each field error shown next to its input.
- **Derived values are recalculated, not trusted.** Open vs Overdue is recalculated from the status and due date every time an invoice is returned, so a stale stored `payment_status` never reaches the client and no scheduled job is needed. Totals aren't stored at all and are always calculated from line items, discount and tax.
- **The repository is behind an interface.** It has a Postgres version for the app and an in-memory version for tests. Lifecycle rules live in the service layer (`invoice.service.ts`).

### LLM-enhanced drafting

`POST /api/invoices/draft-from-text` takes `{ text }` and returns `{ draft, needsReview, filledFields }`. Nothing is saved.

- **Server only.** The Anthropic API key is read from `server/.env` and never reaches the browser.
- **Structured output.** `invoice.llmDraft.ts` calls Claude (`claude-opus-5-5`) with a zod schema, so the response is guaranteed to match. The prompt includes known customers with their recent terms, discounts, line items and account codes, so Claude can resolve common references like "the usual discount" or "same rate as last time", for example.
- **The model extracts; the server decides.**
  - Fields that weren't stated come back as `null`, not guesses.
  - The server matches the customer against real records, fills gaps from that customer's history, calculates the due date from the terms and validates the result.
  - Its own checks (an unknown customer, no line items, validation errors) are added to the model's review notes.
- **Prompt injection.** The request text is wrapped in `<request>` tags, and the prompt treats it as data vs instructions.
- **Fallback.** If there's no API key, or the call fails, is refused or returns bad output, the rule-based drafter (`invoice.draftFromText.ts`) runs instead and flags that AI drafting wasn't available. Both drafters return the same result shape.

### Frontend

- **Hooks hold the behaviour.** Logic lives in hooks under `client/src/hooks` so components mostly render.
- **One folder per component.** Each has `Component.tsx` with its styles in `Component.styled.ts`. Shared design tokens live in `theme/theme.ts`.
- **Shared dropdown components.** `Select` and `CustomerCombobox` are custom ARIA comboboxes, used instead of native `<select>` and `<datalist>` for a more consistent look.
- **Prototype-only features.** Some parts are there for the experience only. See [Unfinished features and workarounds](#unfinished-features-and-workarounds).

## Unfinished features and workarounds

### Unfinished

- **Sidebar navigation.** Only Invoices and Documentation work. The other sections are static, there to show what the full accounting software would feel like.
- **Download PDF.** Shows a "(prototype)" confirmation, but no file is generated. I kept it because it completes the flow of viewing an invoice.
- **Comments.** Interactive but local only. They aren't saved to the database and reset on reload.
- **Delete vs void permissions.** With limited accounting knowledge, I debated whether delete should be allowed on anything unpaid or only on drafts. I went with drafts only, so anything a customer has seen stays on record. A finance team should confirm the rule though.
- **Error summary navigation.** Errors show in a summary and next to each field, but ideally entries in the summary should jump to or highlight their field.
- **Search and filtering at scale.** The client loads every invoice once and searches, filters and totals them in the browser. That's instant for a few hundred invoices but is not scalable. Ideally, Search would become its own query on the server (e.g. `GET /api/invoices?q=acme&status=Overdue&page=2`) backed by database indexes, with paginated results, and the summary card totals would come from a separate aggregate query.
- **Design system page.** It covers tokens, status, banners, buttons and icons. But next I'd add the shared form components (Select, CustomerCombobox, inputs) and their error and disabled states.

### Workarounds

- **Placeholder revenue accounts.** The account codes and names (`4000 Subscription`, `4010 Usage`, …) are inferred from the seed data. They should be replaced with the company's real GL revenue accounts, which I'd expect to come from the accounting team.
- **Customers come from past invoices.** There's no customers table, so picking a customer fills in the email, address, currency, terms and tax rate from their most recent invoice. That means a typo on a voided or draft invoice can become the "usual/autofilled" value, names must match exactly, and the list only knows about invoices already loaded. A real customers table, with invoices pointing to a customer ID, would fix all three.
- **Fixed "today".** Due dates and overdue status are measured from a fixed `AS_OF_DATE` (May 4, 2026, from the seed data) instead of the real date, so the sample invoices keep a realistic mix of statuses.
- **Validation in two places.** The client and server each have their own copy of the validation rules instead of a shared package, so changing a rule means updating both.

## API

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/meta` | company name and the "as of" date |
| GET | `/api/invoices` | all invoices, newest first |
| POST | `/api/invoices` | create a draft, or `"send": true` to create and send |
| GET | `/api/invoices/:id` | one invoice |
| PATCH | `/api/invoices/:id` | drafts change anything, sent invoices only dates, terms and memo |
| POST | `/api/invoices/:id/send` | draft → sent, re-dated to today |
| POST | `/api/invoices/:id/payments` | sent → paid |
| POST | `/api/invoices/:id/void` | sent → void |
| DELETE | `/api/invoices/:id` | drafts only |
| GET | `/api/invoices/draft-examples` | sample billing requests |
| POST | `/api/invoices/draft-from-text` | `{ text }` → `{ draft, needsReview, filledFields }`, not saved |
