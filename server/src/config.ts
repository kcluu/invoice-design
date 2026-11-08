import 'dotenv/config'

export const config = {
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/invoices',
  port: Number(process.env.PORT ?? 4000),
  // optional override, otherwise the seed file's current date is used
  asOfDate: process.env.AS_OF_DATE,
}
