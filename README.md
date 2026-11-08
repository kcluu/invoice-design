# invoice-design

Customer invoices for Northstar Metrics: create, view, edit and delete, plus a first pass at drafting an invoice from a plain text billing request.

- `client/` React + TypeScript (Vite, styled-components)
- `server/` Node + TypeScript API (Express) backed by Postgres
- `data/invoices.json` seed data and example billing requests

## Running it

You need Node 20+ and Docker (or any Postgres 14+).

```bash
npm install
npm run db:up                         # postgres 16 in docker on :5432
cp server/.env.example server/.env
npm run db:reset --workspace server   # creates the table and loads data/invoices.json
npm run dev:server                    # api on http://localhost:4000
npm run dev:client                    # app on http://localhost:5173
```

The seed data is dated May 2026, so due dates are measured from `AS_OF_DATE` (defaults to the seed file's `currentDate`, 2026-05-04). Change it in `server/.env` to see invoices age.

## Tests

```bash
npm test                              # both workspaces
npm test --workspace server           # validation, service rules, routes, draft parser
npm test --workspace client           # hooks, utils and components
```

Server tests run against an in-memory repository, so they don't need Postgres.

## How it's put together

### Data model

One `invoices` table holds the whole invoice. Line items and the activity log are `jsonb` arrays on the row, which keeps reads to a single query and matches the shape of the seed file. Postgres enforces the basics (status values, terms, memo length, `due_date >= issue_date`, tax between 0 and 1), and the API validates the rest with zod before anything is written:

- customer and a valid billing email are required
- at least one line item, each with a description, quantity above 0 and a unit price of 0 or more
- discount can't exceed the subtotal
- once sent, only the dates, terms and memo can change; paid and void invoices can't be edited
- paid invoices can't be deleted

`paymentStatus` is derived from `status` and the due date on every read, so "Overdue" never goes stale.

### Endpoints

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/meta` | company name and the "as of" date used for due dates |
| GET | `/api/invoices` | all invoices, newest first |
| POST | `/api/invoices` | create a draft, or pass `"send": true` to create and send |
| GET | `/api/invoices/:id` | one invoice |
| PATCH | `/api/invoices/:id` | drafts can change anything, sent invoices only dates, terms and memo |
| POST | `/api/invoices/:id/send` | draft → sent |
| POST | `/api/invoices/:id/payments` | sent → paid |
| POST | `/api/invoices/:id/void` | sent → void |
| DELETE | `/api/invoices/:id` | paid invoices can't be deleted |
| GET | `/api/invoices/draft-examples` | sample billing requests from the seed file |
| POST | `/api/invoices/draft-from-text` | `{ text }` → `{ draft, needsReview, filledFields }`, nothing is saved |

Validation errors come back as `422 { error, fields: { "lineItems.0.quantity": "must be greater than 0" } }`, and the client shows each one next to its field.

### Frontend

Behaviour lives in hooks under `client/src/hooks` (`useInvoices`, `useInvoice`, `useInvoiceFilters`, `useInvoiceForm`, `useSaveInvoice`, `useInvoiceActions`, `useMenu`, `useFocusTrap`, `useDraftFromText`, …), so components mostly render. Every component sits in its own folder as `Component.tsx` with its styles in `Component.styled.ts`.

Accessibility notes:

- the invoice table has a caption describing the current view and column headers with `scope`
- row actions use the menu button pattern: arrow keys, Home/End, Escape returns focus
- the delete dialog is a labelled `alertdialog` that traps focus, starts on Cancel and closes on Escape
- after a failed save, focus moves to an error summary whose entries jump to the field; invalid fields get `aria-invalid` and a described-by message
- loading skeletons and confirmations are announced through live regions
- text colours meet WCAG AA contrast against their backgrounds

### Draft from text (bonus, first pass)

`server/src/invoices/invoice.draftFromText.ts` turns a request like the examples in `data/invoices.json` into form values. It's rule based for now so it's predictable and testable: it matches known customers, reads terms, quantities and prices, copies "the usual discount" from the customer's last discounted invoice, and lists anything it had to guess in `needsReview`. The result shape is what an LLM-backed version would return, so the parser can be swapped out without touching the client. The draft only fills the form; a person still reviews and saves it.
