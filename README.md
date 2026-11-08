# invoice-design

Customer invoices: create, view, edit and delete.

- `client/` React + TypeScript frontend
- `server/` Node + TypeScript API backed by Postgres
- `data/invoices.json` seed data

## Running the api

```bash
npm install
npm run db:up                         # postgres 16 in docker on :5432
cp server/.env.example server/.env
npm run db:reset --workspace server   # creates the table and loads data/invoices.json
npm run dev:server                    # http://localhost:4000
```

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

Validation errors come back as `422 { error, fields: { "lineItems.0.quantity": "must be greater than 0" } }`.
