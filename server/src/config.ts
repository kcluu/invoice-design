import 'dotenv/config';

export const config = {
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/invoices',
  port: Number(process.env.PORT ?? 4000),
  // optional override, otherwise the seed file's current date is used
  asOfDate: process.env.AS_OF_DATE,
  // optional, turns on claude for draft from text. without it the rule based drafter is used
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || undefined,
  draftModel: process.env.ANTHROPIC_MODEL || 'claude-opus-5-5',
};
